import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ActivityLog from "@/models/log";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { errorResponse } = await requireAuth(["admin"]);
    if (errorResponse) return errorResponse;

    const log = await ActivityLog.find({ user: id });

    if (!log) {
      return NextResponse.json(
        { error: "Activity log not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(log, { status: 200 });
  } catch (error) {
    console.error("GET /api/activity-log/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity log" },
      { status: 500 }
    );
  }
}
