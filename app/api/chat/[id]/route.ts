import connectDB from "@/lib/mongodb";
import { authenticateUser } from "@/lib/authenticateUser";
import { Chat } from "@/models/chat";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const chat = await Chat.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(id),
        },
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

      { $unwind: "$admins" },

      {
        $project: {
          members: {
            password: 0,
            __v: 0,
            createdAt: 0,
            updatedAt: 0,
          },
          admins: {
            password: 0,
            __v: 0,
            createdAt: 0,
            updatedAt: 0,
          },
          __v: 0,
        },
      },
    ]);

    if (chat.length === 0) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(chat[0], { status: 200 });
  } catch (err) {
    console.error("CHAT GET BY ID ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch chat" },
      { status: 500 }
    );
  }
}
