import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import events from "@/models/events";
import { eventSchema } from "@/schemas/events";
import { logActivity } from "@/utils/logger";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { user: decoded, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const body = await request.json();

    const validated = eventSchema.parse(body);

    const newEvent = await events.create({
      ...validated,
    });

    await logActivity({
      userId: decoded.id.toString(),
      action: "create",
      entityType: "task",
      entityId: newEvent._id.toString(),
      message: `Created event "${validated.title}"`,
      metadata: {
        title: validated.title,
        startDate: validated.startDate,
        endDate: validated.endDate,
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
