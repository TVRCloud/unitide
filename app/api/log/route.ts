/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ActivityLog from "@/models/log";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { errorResponse } = await requireAuth(["admin"]);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const skip = Number.parseInt(searchParams.get("skip") || "0");
    const limit = Number.parseInt(searchParams.get("limit") || "50");
    const action = searchParams.get("action");
    const entityType = searchParams.get("entityType");

    const query: Record<string, any> = {};
    if (action) query.action = { $in: action.split(",") };
    if (entityType) query.entityType = { $in: entityType.split(",") };

    const logs = await ActivityLog.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [{ $project: { name: 1, email: 1 } }],
        },
      },

      { $unwind: "$user" },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error("GET /api/log error:", error);
    return NextResponse.json({ error: "Failed to fetch log" }, { status: 500 });
  }
}
