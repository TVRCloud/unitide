import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import chats from "@/models/chats";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { user, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);

    const skip = Number(searchParams.get("skip") ?? 0);
    const limit = Number(searchParams.get("limit") ?? 20);
    const search = searchParams.get("search")?.trim() ?? "";

    const userId = new mongoose.Types.ObjectId(user.id);

    const pipeline: mongoose.PipelineStage[] = [
      // 1️⃣ Only chats where user is a participant
      {
        $match: {
          participants: userId,
        },
      },

      // 2️⃣ Fetch participant details
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

      // 3️⃣ Search by participant name
      ...(search
        ? [
            {
              $match: {
                "participantDetails.name": {
                  $regex: search,
                  $options: "i",
                },
              },
            },
          ]
        : []),

      // 4️⃣ Last message lookup
      {
        $lookup: {
          from: "messages",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessageDetails",
        },
      },

      // 5️⃣ Unread message count
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
                      $not: {
                        $in: [userId, { $ifNull: ["$deletedFor", []] }],
                      },
                    },
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          as: "unreadMessages",
        },
      },

      // 6️⃣ Computed fields
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
                $getField: {
                  field: { $toString: userId },
                  input: "$isMuted",
                },
              },
              false,
            ],
          },
        },
      },

      // 7️⃣ Cleanup
      {
        $project: {
          participantDetails: 0,
          lastMessageDetails: 0,
          unreadMessages: 0,
        },
      },

      // 8️⃣ Sort + pagination
      { $sort: { lastMessageAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const data = await chats.aggregate(pipeline);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[Chats GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
