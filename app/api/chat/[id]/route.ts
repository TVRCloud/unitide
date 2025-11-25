import connectDB from "@/lib/mongodb";
import { authenticateUser } from "@/lib/authenticateUser";
import { Chat } from "@/models/chat";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { user, errorResponse } = await authenticateUser([
      "admin",
      "manager",
      "lead",
      "member",
    ]);
    if (errorResponse) return errorResponse;

    const chatId = new mongoose.Types.ObjectId(params.id);

    const chat = await Chat.findById(chatId)
      .populate("members", "_id name email")
      .populate("admins", "_id name");

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(chat, { status: 200 });
  } catch (err) {
    console.error("CHAT GET BY ID ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch chat" },
      { status: 500 }
    );
  }
}
