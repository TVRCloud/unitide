import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import tasks from "@/models/tasks";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const task = await tasks.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(id),
        },
      },

      // ---------------- PROJECT + MANAGER ----------------
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "project",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "manager",
                foreignField: "_id",
                as: "manager",
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$project",
          preserveNullAndEmptyArrays: true,
        },
      },

      // ---------------- CREATED BY ----------------
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },

      // ---------------- UPDATED BY ----------------
      {
        $lookup: {
          from: "users",
          localField: "updatedBy",
          foreignField: "_id",
          as: "updatedBy",
        },
      },

      // ---------------- ASSIGNED TO ----------------
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedTo",
        },
      },

      // ---------------- WATCHERS ----------------
      {
        $lookup: {
          from: "users",
          localField: "watchers",
          foreignField: "_id",
          as: "watchers",
        },
      },

      // ---------------- TEAMS ----------------
      {
        $lookup: {
          from: "teams",
          localField: "teams",
          foreignField: "_id",
          as: "teams",
        },
      },

      // ---------------- SUBTASKS ----------------
      {
        $lookup: {
          from: "tasks",
          localField: "subtasks",
          foreignField: "_id",
          as: "subtasks",
        },
      },

      // ---------------- COMMENTS ----------------
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },

      // ---------------- ATTACHMENTS.uploadedBy ----------------
      {
        $lookup: {
          from: "users",
          localField: "attachments.uploadedBy",
          foreignField: "_id",
          as: "attachmentUsers",
        },
      },
      {
        $addFields: {
          attachments: {
            $map: {
              input: "$attachments",
              as: "att",
              in: {
                $mergeObjects: [
                  "$$att",
                  {
                    uploadedBy: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$attachmentUsers",
                            as: "u",
                            cond: { $eq: ["$$u._id", "$$att.uploadedBy"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },

      // ---------------- TIME LOG USERS ----------------
      {
        $lookup: {
          from: "users",
          localField: "timeLogs.user",
          foreignField: "_id",
          as: "timeLogUsers",
        },
      },
      {
        $addFields: {
          timeLogs: {
            $map: {
              input: "$timeLogs",
              as: "log",
              in: {
                $mergeObjects: [
                  "$$log",
                  {
                    user: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$timeLogUsers",
                            as: "u",
                            cond: { $eq: ["$$u._id", "$$log.user"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task[0], { status: 200 });
  } catch (error) {
    console.error("GET /api/task/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}
