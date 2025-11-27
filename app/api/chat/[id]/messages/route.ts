/* eslint-disable @typescript-eslint/no-explicit-any */
import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import { Message } from "@/models/message";
import mongoose from "mongoose";
import { Schema } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const { errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const { id } = await context.params;

    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");

    const messages = await Message.aggregate([
      { $match: { chatId: new mongoose.Types.ObjectId(id) } },
      { $sort: { createdAt: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { user, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const chatId = id;
    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { content, attachments, replyTo, meta } = body;

    if (!content && (!attachments || attachments.length === 0)) {
      return NextResponse.json(
        { error: "Message content or attachments required" },
        { status: 400 }
      );
    }

    const newMessage = await Message.create({
      chatId: new mongoose.Types.ObjectId(chatId),
      sender: user.id,
      content: content || "",
      attachments:
        attachments?.map((a: any) => ({
          url: a.url,
          type: a.type,
          size: a.size,
          name: a.name,
        })) || [],
      replyTo: replyTo ? new Schema.Types.ObjectId(replyTo) : undefined,
      meta: meta || {},
    });

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error("POST /api/chat/[id]/messages error", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
