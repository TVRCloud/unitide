import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import tasks from "@/models/tasks";
import { updateTaskSchema } from "@/schemas/task";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { errorResponse } = await authenticateUser([
      "admin",
      "manager",
      "lead",
      "user",
    ]);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const validated = updateTaskSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.flatten() },
        { status: 400 }
      );
    }

    const task = await tasks.findByIdAndUpdate(id, validated.data, {
      new: true,
    });

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/task/[id]/assignees error:", error);
    return NextResponse.json(
      { error: "Failed to update assignees" },
      { status: 500 }
    );
  }
}
