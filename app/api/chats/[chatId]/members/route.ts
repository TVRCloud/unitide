/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Chat } from "@/models/chat";
import { authenticateUser } from "@/lib/authenticateUser";
import { Types } from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const { chatId } = params;

    const chat = await Chat.aggregate([
      { $match: { _id: new Types.ObjectId(chatId) } },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members",
        },
      },
      {
        $project: {
          members: {
            $map: {
              input: "$members",
              as: "member",
              in: {
                _id: "$$member._id",
                name: "$$member.name",
                avatar: "$$member.avatar",
                email: "$$member.email",
                status: "$$member.status",
              },
            },
          },
        },
      },
    ]);

    if (!chat.length) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(chat[0].members, { status: 200 });
  } catch (error) {
    console.error("GET /api/chats/:chatId/members error:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const { chatId } = params;
    const { userId } = await req.json();

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (!chat.admins.includes(decoded.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!chat.members.includes(userId)) {
      chat.members.push(userId);
      await chat.save();
    }

    const updatedChat = await Chat.aggregate([
      { $match: { _id: chat._id } },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members",
        },
      },
      {
        $project: {
          members: {
            $map: {
              input: "$members",
              as: "member",
              in: {
                _id: "$$member._id",
                name: "$$member.name",
                avatar: "$$member.avatar",
                email: "$$member.email",
                status: "$$member.status",
              },
            },
          },
        },
      },
    ]);

    return NextResponse.json(updatedChat[0].members, { status: 200 });
  } catch (error) {
    console.error("POST /api/chats/:chatId/members error:", error);
    return NextResponse.json(
      { error: "Failed to add member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const { chatId } = params;
    const { memberId } = await req.json();

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (!chat.admins.includes(decoded.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    chat.members = chat.members.filter((m: any) => !m.equals(memberId));
    await chat.save();

    const updatedChat = await Chat.aggregate([
      { $match: { _id: chat._id } },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members",
        },
      },
      {
        $project: {
          members: {
            $map: {
              input: "$members",
              as: "member",
              in: {
                _id: "$$member._id",
                name: "$$member.name",
                avatar: "$$member.avatar",
                email: "$$member.email",
                status: "$$member.status",
              },
            },
          },
        },
      },
    ]);

    return NextResponse.json(updatedChat[0].members, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/chats/:chatId/members error:", error);
    return NextResponse.json(
      { error: "Failed to remove member" },
      { status: 500 }
    );
  }
}
