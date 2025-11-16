import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import { Notification } from "@/models/notification";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const { user, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const notifications = await Notification.aggregate([
      {
        $match: {
          $or: [
            { type: "BROADCAST", audienceType: "ALL" },
            { type: "ROLE_BASED", audienceType: "ROLE", roles: user.role },
            {
              type: "DIRECT",
              audienceType: "USER",
              users: new mongoose.Types.ObjectId(user.id),
            },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 50 },
      {
        $lookup: {
          from: "notificationreads",
          let: { notifId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$notificationId", "$$notifId"] },
                    {
                      $eq: [
                        "$userId",
                        mongoose.Types.ObjectId.createFromHexString(user.id),
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "readInfo",
        },
      },
      {
        $addFields: {
          read: { $cond: [{ $gt: [{ $size: "$readInfo" }, 0] }, true, false] },
        },
      },
      { $project: { readInfo: 0 } },
    ]);

    return NextResponse.json(notifications);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
