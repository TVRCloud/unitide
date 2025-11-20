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

    const userId = new mongoose.Types.ObjectId(user.id);
    const userRole = user.role;
    const isAdmin = user.role === "admin";

    const matchStage = isAdmin
      ? {}
      : {
          $or: [
            { audienceType: "ALL" },
            {
              audienceType: "ROLE",
              roles: { $in: [userRole] },
            },
            {
              audienceType: "USER",
              users: { $in: [userId] },
            },
          ],
        };

    const notifications = await Notification.aggregate([
      {
        $match: matchStage,
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
                    { $eq: ["$userId", userId] },
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

export async function POST(req: Request) {
  try {
    await connectDB();
    const { errorResponse } = await authenticateUser(["admin", "manager"]);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const { type, title, body: content, audienceType, roles, users } = body;

    if (!type || !title || !content || !audienceType)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const notification = await Notification.create({
      type,
      title,
      body: content,
      audienceType,
      roles,
      users,
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
