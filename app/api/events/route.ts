/* eslint-disable @typescript-eslint/no-explicit-any */
import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import events from "@/models/events";
import { logActivity } from "@/utils/logger";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);

    const skip = Number(searchParams.get("skip") ?? 0);
    const limit = Number(searchParams.get("limit") ?? 10);
    const search = searchParams.get("search")?.trim();

    const pipeline: any[] = [];

    /* ---------- SEARCH ---------- */
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    /* ---------- SORT ---------- */
    pipeline.push({
      $sort: { startDate: 1 },
    });

    /* ---------- PAGINATION ---------- */
    pipeline.push({ $skip: skip }, { $limit: limit });

    /* ---------- USERS LOOKUP ---------- */
    pipeline.push(
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
          title: 1,
          description: 1,
          startDate: 1,
          startTime: 1,
          endDate: 1,
          endTime: 1,
          color: 1,
          createdAt: 1,
          updatedAt: 1,
          users: {
            _id: 1,
            name: 1,
            email: 1,
          },
        },
      }
    );

    const eventData = await events.aggregate(pipeline);

    return NextResponse.json(eventData, { status: 200 });
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const body = await request.json();

    const newEvent = await events.create({
      ...body,
    });

    await logActivity({
      userId: decoded.id.toString(),
      action: "create",
      entityType: "task",
      entityId: newEvent._id.toString(),
      message: `Created event "${body.title}"`,
      metadata: {
        title: body.title,
        startDate: body.startDate,
        endDate: body.endDate,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
