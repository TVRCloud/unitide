import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import projects from "@/models/projects";
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

    const project = await projects.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(id),
        },
      },
      {
        $lookup: {
          from: "teams",
          localField: "teams",
          foreignField: "_id",
          as: "teams",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "members",
                foreignField: "_id",
                as: "members",
                pipeline: [
                  {
                    $project: {
                      password: 0,
                      __v: 0,
                      createdAt: 0,
                      updatedAt: 0,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
          pipeline: [
            { $project: { password: 0, __v: 0, createdAt: 0, updatedAt: 0 } },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "manager",
          foreignField: "_id",
          as: "manager",
          pipeline: [
            { $project: { password: 0, __v: 0, createdAt: 0, updatedAt: 0 } },
          ],
        },
      },
      { $unwind: "$createdBy" },
      { $unwind: "$manager" },
    ]);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project[0], { status: 200 });
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
