import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import chats from "@/models/chats";
import users from "@/models/users";
import { createPrivateChatSchema } from "@/schemas/chats";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { user, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const body = await request.json();

    // Validate input
    const validation = createPrivateChatSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
        },
        { status: 400 }
      );
    }

    const { participantId } = validation.data;
    const userId = user.id;

    // Check if user is trying to chat with themselves
    if (userId === participantId) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot create chat with yourself",
        },
        { status: 400 }
      );
    }

    // Check if participant exists
    const participant = await users.findById(participantId);
    if (!participant) {
      return NextResponse.json(
        {
          success: false,
          error: "Participant not found",
        },
        { status: 404 }
      );
    }

    // Check if private chat already exists
    const existingChat = await chats
      .findOne({
        type: "private",
        participants: { $all: [userId, participantId], $size: 2 },
      })
      .populate("participants", "name email avatar isOnline lastSeen")
      .lean();

    if (existingChat) {
      return NextResponse.json({
        success: true,
        data: existingChat,
      });
    }

    // Create new private chat
    const chat = await chats.create({
      type: "private",
      participants: [userId, participantId],
      createdBy: userId,
    });

    const populatedChat = await chats
      .findById(chat._id)
      .populate("participants", "name email avatar isOnline lastSeen")
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: populatedChat,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Chats Private POST] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
