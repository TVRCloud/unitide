import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import { Notification } from "@/models/notification";
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

    const notification = await Notification.aggregate([
      { $match: { _id: mongoose.Types.ObjectId.createFromHexString(id) } },
      {
        $addFields: {
          users: {
            $map: {
              input: "$users",
              as: "u",
              in: { $toObjectId: "$$u" },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $project: {
          users: 1,
          type: 1,
          title: 1,
          body: 1,
          audienceType: 1,
          roles: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(notification[0], { status: 200 });
  } catch (error) {
    console.error("Get /api/notification/[id]", error);
    return NextResponse.json(
      { error: "Failed to fetch notification" },
      { status: 500 }
    );
  }
}
