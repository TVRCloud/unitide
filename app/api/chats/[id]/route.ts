import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import chats from "@/models/chats";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { user, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const userId = mongoose.Types.ObjectId.createFromHexString(user.id);
    const chatObjectId = mongoose.Types.ObjectId.createFromHexString(id);

    const data = await chats.aggregate([
      // 1️⃣ Match chat + access control
      {
        $match: {
          _id: chatObjectId,
          participants: userId,
        },
      },

      // 2️⃣ Lookup participants
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participants",
          pipeline: [
            {
              $project: {
                name: 1,
                email: 1,
                avatar: 1,
                isOnline: 1,
                lastSeen: 1,
              },
            },
          ],
        },
      },

      // 3️⃣ Lookup admins
      {
        $lookup: {
          from: "users",
          localField: "admins",
          foreignField: "_id",
          as: "admins",
          pipeline: [
            {
              $project: {
                name: 1,
                email: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
    ]);

    if (!data.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Chat not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(data[0], { status: 200 });
  } catch (error) {
    console.error("GET /api/chats/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat" },
      { status: 500 }
    );
  }
}
