import { requireAuth } from "@/lib/auth-guard";
import connectDB from "@/lib/mongodb";
import teams from "@/models/teams";
import { createTeamSchema } from "@/schemas/teams";
import { logActivity } from "@/utils/logger";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { errorResponse } = await requireAuth(["admin", "manager"]);
    if (errorResponse) return errorResponse;

    const team = await teams.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members",
          pipeline: [
            { $project: { password: 0, __v: 0, createdAt: 0, updatedAt: 0 } },
          ],
        },
      },

      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "teams",
          as: "projects",
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
      { $unwind: "$createdBy" },

      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          members: 1,
          projects: 1,
          createdBy: 1,
        },
      },
    ]);

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(team[0], { status: 200 });
  } catch (error) {
    console.error("GET /api/teams/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { user: decoded, errorResponse } = await requireAuth([
      "admin",
      "manager",
    ]);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const validated = createTeamSchema.parse(body);

    if (decoded.role !== "admin") {
      const team = await teams.findById(id);

      if (!team) {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
      }

      if (team.createdBy.toString() !== decoded.id) {
        return NextResponse.json(
          { error: "You are not authorized to update this team" },
          { status: 403 }
        );
      }
    }

    const updatedTeam = await teams.findByIdAndUpdate(id, validated, {
      new: true,
    });

    await logActivity({
      userId: decoded.id,
      action: "update",
      entityType: "team",
      entityId: id,
      message: `Team ${updatedTeam.name} updated`,
    });

    return NextResponse.json(
      { message: "Team updated successfully", data: updatedTeam },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/teams/[id]", error);

    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { user: decoded, errorResponse } = await requireAuth([
      "admin",
      "manager",
    ]);
    if (errorResponse) return errorResponse;

    if (decoded.role !== "admin") {
      const team = await teams.findById(id);
      if (!team) {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
      }

      if (team.createdBy.toString() !== decoded.id) {
        return NextResponse.json(
          { error: "You are not authorized to update this team" },
          { status: 403 }
        );
      }
    }

    const deletedTeam = await teams.findByIdAndDelete(id);

    await logActivity({
      userId: decoded.id,
      action: "delete",
      entityType: "team",
      entityId: id,
      message: `Team ${deletedTeam.name} deleted`,
    });

    return NextResponse.json(
      { message: "Team deleted successfully", data: deletedTeam },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/teams/[id]", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
}
