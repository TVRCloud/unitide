import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Chat } from "@/models/chat";
import { authenticateUser } from "@/lib/authenticateUser";
import { Types } from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const chats = await Chat.aggregate([
      {
        $match: { members: new Types.ObjectId(decoded.id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "admins",
          foreignField: "_id",
          as: "admins",
        },
      },
      {
        $project: {
          title: 1,
          type: 1,
          avatar: 1,
          isPinned: 1,
          isArchived: 1,
          createdAt: 1,
          updatedAt: 1,
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
          admins: {
            $map: {
              input: "$admins",
              as: "admin",
              in: {
                _id: "$$admin._id",
                name: "$$admin.name",
                avatar: "$$admin.avatar",
              },
            },
          },
        },
      },
      { $sort: { updatedAt: -1 } },
    ]);

    return NextResponse.json(chats, { status: 200 });
  } catch (error) {
    console.error("GET /api/chats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const { title, type, members, avatar } = await req.json();

    const chat = new Chat({
      title,
      type,
      members: [...members, decoded.id],
      admins: [decoded.id],
      avatar,
    });

    await chat.save();

    const populatedChat = await Chat.aggregate([
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
          title: 1,
          type: 1,
          avatar: 1,
          isPinned: 1,
          isArchived: 1,
          createdAt: 1,
          updatedAt: 1,
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
          admins: 1,
        },
      },
    ]);

    return NextResponse.json(populatedChat[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/chats error:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}
