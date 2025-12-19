import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import chats from "@/models/chats";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const { user, errorResponse } = await authenticateUser(["admin"]);
    if (errorResponse) return errorResponse;

    const userId = new mongoose.Types.ObjectId(user.id);

    const data = await chats.aggregate([
      // Match chats where user is a participant
      {
        $match: {
          participants: userId,
        },
      },
      // Lookup participants details
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participantDetails",
          pipeline: [
            {
              $project: {
                name: 1,
                email: 1,
                avatar: 1,
                isOnline: 1,
                lastSeen: 1,
              },
            },
          ],
        },
      },
      // Lookup last message
      {
        $lookup: {
          from: "messages",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessageDetails",
        },
      },
      // Lookup unread count
      {
        $lookup: {
          from: "messages",
          let: { chatId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$chatId", "$$chatId"] },
                    { $ne: ["$senderId", userId] },
                    {
                      $not: { $in: [userId, { $ifNull: ["$deletedFor", []] }] },
                    },
                  ],
                },
              },
            },
            {
              $count: "count",
            },
          ],
          as: "unreadMessages",
        },
      },
      // Add computed fields
      {
        $addFields: {
          participants: "$participantDetails",
          lastMessage: { $arrayElemAt: ["$lastMessageDetails", 0] },
          unreadCount: {
            $ifNull: [{ $arrayElemAt: ["$unreadMessages.count", 0] }, 0],
          },
          lastMessagePreview: {
            $switch: {
              branches: [
                {
                  case: {
                    $eq: [
                      { $arrayElemAt: ["$lastMessageDetails.type", 0] },
                      "text",
                    ],
                  },
                  then: { $arrayElemAt: ["$lastMessageDetails.content", 0] },
                },
                {
                  case: {
                    $eq: [
                      { $arrayElemAt: ["$lastMessageDetails.type", 0] },
                      "image",
                    ],
                  },
                  then: "📷 Image",
                },
                {
                  case: {
                    $eq: [
                      { $arrayElemAt: ["$lastMessageDetails.type", 0] },
                      "video",
                    ],
                  },
                  then: "🎥 Video",
                },
                {
                  case: {
                    $eq: [
                      { $arrayElemAt: ["$lastMessageDetails.type", 0] },
                      "audio",
                    ],
                  },
                  then: "🎤 Audio",
                },
                {
                  case: {
                    $eq: [
                      { $arrayElemAt: ["$lastMessageDetails.type", 0] },
                      "file",
                    ],
                  },
                  then: "📎 File",
                },
              ],
              default: "",
            },
          },
          isArchived: {
            $ifNull: [
              {
                $getField: {
                  field: { $toString: userId },
                  input: "$isArchived",
                },
              },
              false,
            ],
          },
          isMuted: {
            $ifNull: [
              {
                $getField: { field: { $toString: userId }, input: "$isMuted" },
              },
              false,
            ],
          },
        },
      },
      // Remove temporary fields
      {
        $project: {
          participantDetails: 0,
          lastMessageDetails: 0,
          unreadMessages: 0,
        },
      },
      // Sort by last message time
      {
        $sort: { lastMessageAt: -1 },
      },
    ]);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[Chats GET] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
