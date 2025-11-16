/* eslint-disable @typescript-eslint/no-explicit-any */
import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import { Notification } from "@/models/notification";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { user, errorResponse } = await authenticateUser([
      "admin",
      "manager",
    ]);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type");
    const audienceType = searchParams.get("audienceType");
    const role = searchParams.get("role");
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
      ];
    }

    if (type) query.type = type;
    if (audienceType) query.audienceType = audienceType;

    query.$or = [
      { type: "BROADCAST", audienceType: "ALL" },
      { type: "ROLE_BASED", audienceType: "ROLE", roles: user.role },
      {
        type: "DIRECT",
        audienceType: "USER",
        users: new mongoose.Types.ObjectId(user.id),
      },
    ];

    if (role) query.roles = role;

    const notifications = await Notification.aggregate([
      { $match: query },
      { $sort: { [sortField]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
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
      {
        $project: {
          _id: 1,
          title: 1,
          body: 1,
          type: 1,
          audienceType: 1,
          createdAt: 1,
          read: 1,
        },
      },
    ]);

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("GET /api/notifications/all error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
