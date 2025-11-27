import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Message } from "@/models/message";
import { authenticateUser } from "@/lib/authenticateUser";
import { Types } from "mongoose";

export async function GET(
  req: Request,
  context: { params: Promise<{ chatId: string }> }
) {
  try {
    await connectDB();
    const { chatId } = await context.params;
    const { errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const url = new URL(req.url);
    const limit = Number.parseInt(url.searchParams.get("limit") || "30", 10);
    const skip = Number.parseInt(url.searchParams.get("skip") || "0", 10);

    const messages = await Message.aggregate([
      { $match: { chatId: new Types.ObjectId(chatId) } },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      { $unwind: "$sender" },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          chatId: 1,
          content: 1,
          attachments: 1,
          status: 1,
          meta: 1,
          readBy: 1,
          createdAt: 1,
          updatedAt: 1,
          sender: {
            _id: "$sender._id",
            name: "$sender.name",
            avatar: "$sender.avatar",
            email: "$sender.email",
          },
        },
      },
    ]);

    return NextResponse.json(messages.reverse(), { status: 200 });
  } catch (error) {
    console.error("GET /api/chats/:chatId/messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
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
    const { content, attachments } = await req.json();

    const message = new Message({
      chatId,
      sender: decoded.id,
      content,
      attachments: attachments || [],
      status: "SENT",
    });

    await message.save();

    const populatedMessage = await Message.aggregate([
      { $match: { _id: message._id } },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      { $unwind: "$sender" },
      {
        $project: {
          _id: 1,
          chatId: 1,
          content: 1,
          attachments: 1,
          status: 1,
          meta: 1,
          readBy: 1,
          createdAt: 1,
          updatedAt: 1,
          sender: {
            _id: "$sender._id",
            name: "$sender.name",
            avatar: "$sender.avatar",
            email: "$sender.email",
          },
        },
      },
    ]);

    return NextResponse.json(populatedMessage[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/chats/:chatId/messages error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
