import { requireAuth } from "@/lib/auth-guard";
import connectDB from "@/lib/mongodb";
import workspace from "@/models/workspace";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const { errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    let doc = await workspace.findOne();
    if (!doc) {
      doc = await workspace.create({});
    }

    return NextResponse.json(doc, { status: 200 });
  } catch (error) {
    console.error("GET /api/workspace error:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspace settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const { user, errorResponse } = await requireAuth(["admin"]);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const allowed = [
      "orgName",
      "timezone",
      "defaultPriority",
      "workingDays",
      "workingHours",
      "maxFileSizeMB",
    ];

    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    const doc = await workspace.findOneAndUpdate(
      {},
      { $set: updates },
      { new: true, upsert: true }
    );

    void user;
    return NextResponse.json(doc, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/workspace error:", error);
    return NextResponse.json(
      { error: "Failed to update workspace settings" },
      { status: 500 }
    );
  }
}
