// const notifId = params.id;

import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import { Notification } from "@/models/notification";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { user, errorResponse } = await authenticateUser([
      "admin",
      "manager",
    ]);
    if (errorResponse) return errorResponse;

    const notification = await Notification.aggregate([
      { $match: { _id: mongoose.Types.ObjectId.createFromHexString(id) } },
      {
        $match: {
          $or: [
            { type: "BROADCAST", audienceType: "ALL" },
            { type: "ROLE_BASED", audienceType: "ROLE", roles: user.role },
            {
              type: "DIRECT",
              audienceType: "USER",
              users: mongoose.Types.ObjectId.createFromHexString(user.id),
            },
          ],
        },
      },
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
    ]);

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(notification[0], { status: 200 });
  } catch (error) {
    console.error("Get /api/notification/[id]", error);
    return NextResponse.json(
      { error: "Failed to fetch notification" },
      { status: 500 }
    );
  }
}
