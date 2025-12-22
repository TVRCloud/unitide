import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { authenticateUser } from "@/lib/authenticateUser";
import chats from "@/models/chats";
import message from "@/models/message";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { user, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const userId = mongoose.Types.ObjectId.createFromHexString(user.id);

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Verify user is a participant
    const chat = await chats.findOne({
      _id: id,
      participants: userId,
    });

    if (!chat) {
      return NextResponse.json(
        {
          success: false,
          error: "Chat not found or you are not a participant",
        },
        { status: 404 }
      );
    }

    const result = await message.aggregate([
      // Match messages for this chat (excluding deleted ones)
      {
        $match: {
          chatId: mongoose.Types.ObjectId.createFromHexString(id),
          deletedFor: { $ne: userId },
        },
      },
      // Facet for pagination and total count
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          messages: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            // Lookup sender details
            {
              $lookup: {
                from: "users",
                localField: "senderId",
                foreignField: "_id",
                as: "senderDetails",
                pipeline: [
                  {
                    $project: {
                      name: 1,
                      email: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            // Lookup reply-to message
            {
              $lookup: {
                from: "messages",
                localField: "replyTo",
                foreignField: "_id",
                as: "replyToDetails",
              },
            },
            // Lookup reactions
            {
              $lookup: {
                from: "reactions",
                localField: "_id",
                foreignField: "messageId",
                as: "reactions",
                pipeline: [
                  {
                    $lookup: {
                      from: "users",
                      localField: "userId",
                      foreignField: "_id",
                      as: "userDetails",
                      pipeline: [
                        {
                          $project: {
                            name: 1,
                            avatar: 1,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $addFields: {
                      userId: { $arrayElemAt: ["$userDetails", 0] },
                    },
                  },
                  {
                    $project: {
                      userDetails: 0,
                    },
                  },
                ],
              },
            },
            // Lookup message status (for messages sent by current user)
            {
              $lookup: {
                from: "messagestatuses",
                let: { messageId: "$_id", senderId: "$senderId" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$messageId", "$$messageId"] },
                          { $eq: ["$$senderId", userId] },
                        ],
                      },
                    },
                  },
                ],
                as: "messageStatuses",
              },
            },
            // Add computed fields
            {
              $addFields: {
                senderId: { $arrayElemAt: ["$senderDetails", 0] },
                replyTo: { $arrayElemAt: ["$replyToDetails", 0] },
                status: {
                  $cond: {
                    if: { $eq: ["$senderId._id", userId] },
                    then: {
                      $cond: {
                        if: {
                          $allElementsTrue: {
                            $map: {
                              input: "$messageStatuses",
                              as: "status",
                              in: { $eq: ["$$status.status", "read"] },
                            },
                          },
                        },
                        then: "read",
                        else: {
                          $cond: {
                            if: {
                              $allElementsTrue: {
                                $map: {
                                  input: "$messageStatuses",
                                  as: "status",
                                  in: {
                                    $in: [
                                      "$$status.status",
                                      ["delivered", "read"],
                                    ],
                                  },
                                },
                              },
                            },
                            then: "delivered",
                            else: "sent",
                          },
                        },
                      },
                    },
                    else: null,
                  },
                },
              },
            },
            // Remove temporary fields
            {
              $project: {
                senderDetails: 0,
                replyToDetails: 0,
                messageStatuses: 0,
              },
            },
          ],
        },
      },
    ]);

    const totalCount = result[0]?.metadata[0]?.totalCount || 0;
    const messages = result[0]?.messages || [];

    return NextResponse.json({
      data: {
        messages: messages.reverse(), // Reverse to show oldest first
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: skip + messages.length < totalCount,
        },
      },
    });
  } catch (error) {
    console.error("GET /api/messages/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
