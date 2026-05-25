import { requireAuth } from "@/lib/auth-guard";
import connectDB from "@/lib/mongodb";
import events from "@/models/events";
import { logActivity } from "@/utils/logger";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await request.json();

    const updated = await events.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );
    if (!updated)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    await logActivity({
      userId: decoded.id.toString(),
      action: "update",
      entityType: "task",
      entityId: id,
      message: `Updated event "${updated.title}"`,
      metadata: { title: updated.title },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/events/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const deleted = await events.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    await logActivity({
      userId: decoded.id.toString(),
      action: "delete",
      entityType: "task",
      entityId: id,
      message: `Deleted event "${deleted.title}"`,
      metadata: {},
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/events/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
