import { requireAuth } from "@/lib/auth-guard";
import connectDB from "@/lib/mongodb";
import tasks from "@/models/tasks";
import { NextResponse } from "next/server";
import type { PipelineStage } from "mongoose";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const userId = searchParams.get("userId");

    const pipeline: PipelineStage[] = [
      { $match: { isDeleted: false, "timeLogs.0": { $exists: true } } },
      { $unwind: "$timeLogs" },
    ];

    const logMatch: Record<string, unknown> = {};
    if (dateFrom) logMatch["timeLogs.createdAt"] = { $gte: new Date(dateFrom) };
    if (dateTo) {
      logMatch["timeLogs.createdAt"] = {
        ...(logMatch["timeLogs.createdAt"] as object),
        $lte: new Date(dateTo),
      };
    }
    if (userId) logMatch["timeLogs.user"] = userId;
    if (Object.keys(logMatch).length) pipeline.push({ $match: logMatch });

    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "timeLogs.user",
          foreignField: "_id",
          as: "logUser",
        },
      },
      { $unwind: { path: "$logUser", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          taskId: "$_id",
          taskTitle: "$title",
          project: "$project",
          user: {
            _id: "$logUser._id",
            name: "$logUser.name",
            avatar: "$logUser.avatar",
          },
          minutes: "$timeLogs.minutes",
          note: "$timeLogs.note",
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$timeLogs.createdAt",
            },
          },
        },
      },
      { $sort: { date: -1 } }
    );

    const rows = await tasks.aggregate(pipeline);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET /api/task/timelogs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch time logs" },
      { status: 500 }
    );
  }
}
