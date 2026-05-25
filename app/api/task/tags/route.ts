import { requireAuth } from "@/lib/auth-guard";
import connectDB from "@/lib/mongodb";
import tasks from "@/models/tasks";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const { errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const result = await tasks.aggregate([
      { $match: { isDeleted: false, tags: { $exists: true, $ne: [] } } },
      { $unwind: "$tags" },
      { $match: { tags: { $ne: "" } } },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, tag: "$_id", count: 1 } },
    ]);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("GET /api/task/tags error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

// Rename a tag (also works as merge when `to` already exists)
export async function PATCH(request: Request) {
  try {
    await connectDB();
    const { errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const { from, to } = await request.json();
    if (!from || !to || from === to) {
      return NextResponse.json({ error: "Invalid from/to" }, { status: 400 });
    }

    const result = await tasks.updateMany(
      { tags: from, isDeleted: false },
      { $set: { "tags.$[el]": to.trim() } },
      { arrayFilters: [{ el: from }] }
    );

    return NextResponse.json(
      { modified: result.modifiedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/task/tags error:", error);
    return NextResponse.json(
      { error: "Failed to rename tag" },
      { status: 500 }
    );
  }
}

// Delete a tag from all tasks
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    if (!tag) {
      return NextResponse.json({ error: "tag is required" }, { status: 400 });
    }

    const result = await tasks.updateMany(
      { tags: tag, isDeleted: false },
      { $pull: { tags: tag } }
    );

    return NextResponse.json(
      { modified: result.modifiedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/task/tags error:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
