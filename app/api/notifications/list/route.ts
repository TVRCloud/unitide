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

    const isAdmin = user.role === "admin";

    let matchStage;

    if (isAdmin) {
      matchStage = {
        $match: {
          type: "BROADCAST",
        },
      };
    } else {
      // Use $in operator for proper array matching on roles and users
      matchStage = {
        $match: {
          $or: [
            // All users get notifications sent to everyone
            { type: "BROADCAST", audienceType: "ALL" },
            // Users with matching role get role-based notifications
            {
              type: "BROADCAST",
              audienceType: "ROLE",
              roles: { $in: [user.role] },
            },
            // Users whose ID is in the users array get direct notifications
            {
              type: "BROADCAST",
              audienceType: "USER",
              users: { $in: [new mongoose.Types.ObjectId(user.id)] },
            },
          ],
        },
      };
    }

    const notifications = await Notification.aggregate([
      matchStage,
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
