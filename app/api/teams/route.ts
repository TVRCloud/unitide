/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireAuth } from "@/lib/auth-guard";
import connectDB from "@/lib/mongodb";
import "@/models/users";
import teams from "@/models/teams";
import { createTeamSchema } from "@/schemas/teams";
import { logActivity } from "@/utils/logger";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { user, errorResponse } = await requireAuth([
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

    // 1. Filter teams based on the search query
    const baseQuery: any = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    // Convert decoded.id to ObjectId safely
    const userObjectId =
      user.role !== "admin" && user.id
        ? mongoose.Types.ObjectId.createFromHexString(user.id)
        : null;

    if (user.role !== "admin" && userObjectId) {
      baseQuery.$or = [
        { createdBy: userObjectId },
        { members: { $in: [userObjectId] } },
      ];
    }

    // const teamList = await teams
    //   .find(query)
    //   .populate("createdBy", "name email role")
    //   // .populate("members", "name email role")
    //   .skip(skip)
    //   .limit(limit)
    //   .lean();

    const teamList = await teams.aggregate([
      // 2. Filter teams based on the search query
      { $match: baseQuery },

      // 3. Populate 'createdBy' (equivalent to .populate("createdBy", "name email role"))
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      // $lookup always returns an array, and since 'createdBy' is a single reference,
      // we use $unwind to convert the array into a single object and then $project to select fields.
      { $unwind: "$createdBy" },

      // 4. Exclude the password and select necessary fields from the joined 'createdBy'
      // here 1 denote to select all fields and 0 to exclude
      {
        $project: {
          name: 1,
          description: 1,
          createdAt: 1,
          updatedAt: 1,
          members: 1,

          "createdBy._id": 1,
          "createdBy.name": 1,
        },
      },

      // 5. Pagination
      { $skip: skip },
      { $limit: limit },
    ]);

    return NextResponse.json(teamList, { status: 200 });
  } catch (error) {
    console.error("GET /api/teams error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await requireAuth([
      "admin",
      "manager",
    ]);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const validated = createTeamSchema.parse(body);

    const existingTeam = await teams.findOne({ name: validated.name });
    if (existingTeam) {
      return NextResponse.json(
        { error: "Team already exists" },
        { status: 400 }
      );
    }

    const team = await teams.create({
      ...validated,
      createdBy: decoded.id,
    });

    await logActivity({
      userId: decoded.id,
      action: "create",
      entityType: "team",
      entityId: team._id.toString(),
      message: `Created team ${validated.name}`,
      metadata: { name: validated.name, description: validated.description },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("POST /api/teams error:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}
