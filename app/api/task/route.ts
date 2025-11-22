/* eslint-disable @typescript-eslint/no-explicit-any */
import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import tasks from "@/models/tasks";
import { createTaskSchema } from "@/schemas/task";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { user, errorResponse } = await authenticateUser([
      "admin",
      "manager",
      "lead",
      "member",
    ]);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);

    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const userId = mongoose.Types.ObjectId.createFromHexString(user.id);

    const searchMatch = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    const pipeline: any[] = [
      { $match: searchMatch },

      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },

      {
        $lookup: {
          from: "teams",
          localField: "team",
          foreignField: "_id",
          as: "team",
        },
      },
      {
        $unwind: {
          path: "$team",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    if (user.role === "manager") {
      pipeline.push({
        $match: {
          $or: [{ "project.manager": userId }, { "project.createdBy": userId }],
        },
      });
    }

    if (user.role === "lead") {
      pipeline.push({
        $match: {
          $or: [{ "team.lead": userId }, { createdBy: userId }],
        },
      });
    }

    if (user.role === "member") {
      pipeline.push({
        $match: {
          $or: [{ assignedTo: userId }, { createdBy: userId }],
        },
      });
    }

    pipeline.push(
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          title: 1,
          status: 1,
          priority: 1,
          type: 1,
          createdAt: 1,
          updatedAt: 1,
          project: { name: 1, color: 1 },
          team: { name: 1, _id: 1 },
        },
      }
    );

    const taskList = await tasks.aggregate(pipeline);

    return NextResponse.json(taskList, { status: 200 });
  } catch (error) {
    console.error("TASK GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const { user, errorResponse } = await authenticateUser([
      "admin",
      "manager",
      "lead",
    ]);
    if (errorResponse) return errorResponse;

    const body = await request.json();

    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );

    const data = parsed.data;

    const newTask = await tasks.create({
      ...data,
      createdBy: user.id,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();

//     const { user, errorResponse } = await authenticateUser([
//       "admin",
//       "manager",
//       "lead",
//       "user",
//     ]);
//     if (errorResponse) return errorResponse;

//     const body = await request.json();

//     const parsed = updateTaskSchema.safeParse(body);
//     if (!parsed.success)
//       return NextResponse.json(
//         { error: parsed.error.flatten() },
//         { status: 400 }
//       );

//     const updated = await tasks.findByIdAndUpdate(
//       params.id,
//       { ...parsed.data, updatedBy: user.id },
//       { new: true }
//     );

//     return NextResponse.json(updated, { status: 200 });
//   } catch (err) {
//     console.error("PUT /api/tasks/:id error:", err);
//     return NextResponse.json(
//       { error: "Failed to update task" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();

//     const { errorResponse } = await authenticateUser(["admin", "manager"]);
//     if (errorResponse) return errorResponse;

//     await tasks.findByIdAndDelete(params.id);

//     return NextResponse.json({ message: "Task deleted" }, { status: 200 });
//   } catch (err) {
//     console.error("DELETE /api/tasks/:id error:", err);
//     return NextResponse.json(
//       { error: "Failed to delete task" },
//       { status: 500 }
//     );
//   }
// }
