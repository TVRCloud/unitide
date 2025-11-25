/* eslint-disable @typescript-eslint/no-explicit-any */
import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import { Chat } from "@/models/chat";
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

    const search = searchParams.get("search") || "";
    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "20");

    const userId = new mongoose.Types.ObjectId(user.id);

    const matchStage: any = {
      members: userId,
    };

    if (search) {
      matchStage.title = { $regex: search, $options: "i" };
    }

    const pipeline = [
      { $match: matchStage },

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

      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          title: 1,
          type: 1,
          avatar: 1,
          createdAt: 1,
          members: { _id: 1, name: 1, email: 1 },
          admins: { _id: 1, name: 1 },
        },
      },
    ];

    const list = await Chat.aggregate(pipeline);

    return NextResponse.json(list, { status: 200 });
  } catch (err) {
    console.error("CHAT GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
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

    const loggedInId = user.id;

    const members = Array.from(new Set([loggedInId, ...(body.members || [])]));

    if (body.type === "DIRECT") {
      const existingChat = await Chat.findOne({
        type: "DIRECT",
        members: { $all: members, $size: members.length },
      });

      if (existingChat) {
        return NextResponse.json(existingChat, { status: 200 });
      }
    }

    const newChat = await Chat.create({
      ...body,
      members,
      admins: body.admins || [loggedInId],
    });

    return NextResponse.json(newChat, { status: 201 });
  } catch (err) {
    console.error("CHAT POST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}
