/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/chats/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { authenticateUser } from "@/lib/authenticateUser";
import { Chat } from "@/models/chat";
import { createChatSchema } from "@/schemas/chat";

export async function GET(request: Request) {
  await connectDB();
  const { user, errorResponse } = await authenticateUser([
    "admin",
    "manager",
    "lead",
    "member",
  ]);
  if (errorResponse) return errorResponse;

  const url = new URL(request.url);
  const skip = parseInt(url.searchParams.get("skip") || "0");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const search = url.searchParams.get("search") || "";

  const userId = mongoose.Types.ObjectId.createFromHexString(user.id);

  const match: any = { members: { $in: [userId] } };
  if (search) match.title = { $regex: search, $options: "i" };

  const chats = await Chat.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "messages",
        let: { chatId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$chatId", "$$chatId"] } } },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
        ],
        as: "lastMessage",
      },
    },
    { $unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        title: 1,
        type: 1,
        members: 1,
        lastMessage: 1,
        updatedAt: 1,
        unreadCounts: 1,
      },
    },
    { $sort: { updatedAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  return NextResponse.json(chats, { status: 200 });
}

export async function POST(request: Request) {
  await connectDB();
  const { errorResponse } = await authenticateUser([
    "admin",
    "manager",
    "lead",
    "member",
  ]);
  if (errorResponse) return errorResponse;

  const body = await request.json();
  const parsed = createChatSchema.parse(body);

  if (!parsed.members || parsed.members.length < 2) {
    return NextResponse.json(
      { error: "At least 2 members are required for a chat" },
      { status: 400 }
    );
  }

  // Convert member ids to ObjectId
  const memberIds = parsed.members.map(
    (id: string) => new mongoose.Types.ObjectId(id)
  );

  // Only check DIRECT chats
  const existingChat = await Chat.findOne({
    type: "DIRECT",
    members: { $size: 2, $all: memberIds }, // exactly those 2 members
  });

  if (existingChat) {
    // Chat already exists, return it
    return NextResponse.json(existingChat, { status: 200 });
  }

  // Create a new chat
  const chat = await Chat.create({
    ...parsed,
    type: "DIRECT",
    members: memberIds,
    admins: [], // DIRECT chats usually don't have admins
  });

  return NextResponse.json(chat, { status: 201 });
}
