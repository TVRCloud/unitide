/* eslint-disable @typescript-eslint/no-explicit-any */
import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import tasks from "@/models/tasks";
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

    // Base pipeline
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

    // Role-based access ------------------------------------------

    if (user.role === "manager") {
      pipeline.push({
        $match: {
          $or: [
            { "project.manager": userId }, // project manager
            { "project.createdBy": userId }, // project creator
          ],
        },
      });
    }

    if (user.role === "lead") {
      pipeline.push({
        $match: {
          $or: [
            { "team.lead": userId }, // lead of a team
            { createdBy: userId }, // tasks created by lead
          ],
        },
      });
    }

    if (user.role === "member") {
      pipeline.push({
        $match: {
          $or: [
            { assignedTo: userId }, // assigned to them
            { createdBy: userId }, // they created the task
          ],
        },
      });
    }

    // ADMIN: no match added (can see all tasks)

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
          project: { name: 1, _id: 1 },
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
