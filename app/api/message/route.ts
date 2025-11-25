/* eslint-disable @typescript-eslint/no-explicit-any */
import connectDB from "@/lib/mongodb";
import { authenticateUser } from "@/lib/authenticateUser";
import { Message } from "@/models/message";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { user, errorResponse } = await authenticateUser([
      "admin",
      "manager",
      "lead",
      "member",
    ]);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);

    const chatId = searchParams.get("chatId");
    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!chatId) {
      return NextResponse.json({ error: "chatId required" }, { status: 400 });
    }

    const pipeline: any[] = [
      { $match: { chatId: new mongoose.Types.ObjectId(chatId) } },

      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      { $unwind: "$sender" },

      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          content: 1,
          attachments: 1,
          status: 1,
          createdAt: 1,
          sender: { _id: 1, name: 1, email: 1 },
        },
      },
    ];

    const messages = await Message.aggregate(pipeline);

    return NextResponse.json(messages, { status: 200 });
  } catch (err) {
    console.error("MESSAGE GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const { user, errorResponse } = await authenticateUser([
      "admin",
      "manager",
      "lead",
      "member",
    ]);
    if (errorResponse) return errorResponse;

    const body = await request.json();

    const msg = await Message.create({
      ...body,
      sender: user.id,
    });

    return NextResponse.json(msg, { status: 201 });
  } catch (err) {
    console.error("MESSAGE POST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
