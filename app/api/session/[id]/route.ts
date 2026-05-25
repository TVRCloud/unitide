import { requireAuth } from "@/lib/auth-guard";
import connectDB from "@/lib/mongodb";
import userSession from "@/models/session";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { errorResponse } = await requireAuth(["admin"]);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const session = await userSession.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/session/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to terminate session" },
      { status: 500 }
    );
  }
}
