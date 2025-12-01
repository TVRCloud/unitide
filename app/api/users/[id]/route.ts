import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import users from "@/models/users";
import { authenticateUser } from "@/lib/authenticateUser";
import mongoose from "mongoose";
import { updateUserSchema } from "@/schemas/user";
import { logActivity } from "@/utils/logger";
import { getSignedUrl } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { errorResponse } = await authenticateUser(["admin", "manager"]);

    if (errorResponse) return errorResponse;
    // const user = await users.findById(id).select("-password");

    const user = await users.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(id),
        },
      },
      {
        $lookup: {
          from: "teams",
          localField: "_id",
          foreignField: "members",
          as: "teams",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "members",
                foreignField: "_id",
                as: "members",
              },
            },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "teams._id",
          foreignField: "teams",
          as: "projects",
          pipeline: [
            {
              $lookup: {
                from: "teams",
                localField: "teams",
                foreignField: "_id",
                as: "teams",
                pipeline: [
                  // {
                  //   $lookup: {
                  //     from: "users",
                  //     localField: "members",
                  //     foreignField: "_id",
                  //     as: "members",
                  //     pipeline: [
                  //       {
                  //         $project: { name: 1, email: 1, role: 1, isActive: 1 },
                  //       },
                  //     ],
                  //   },
                  // },

                  { $project: { _id: 1, name: 1, description: 1 } },
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
                  {
                    $project: { name: 1, email: 1, role: 1, isActive: 1 },
                  },
                ],
              },
            },
            { $unwind: "$createdBy" },
            {
              $project: {
                _id: 1,
                name: 1,
                description: 1,
                teams: 1,
                createdBy: 1,
              },
            },
          ],
        },
      },
      { $project: { password: 0 } },
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user[0].avatar) {
      const signedUrl = await getSignedUrl(user[0].avatar);
      user[0].avatar = signedUrl || null;
    }

    return NextResponse.json(user[0], { status: 200 });
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
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
    const { user: decoded, errorResponse } = await authenticateUser(["admin"]);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const validated = updateUserSchema.parse(body);

    const allowedUpdates = {
      name: validated.name,
      email: validated.email,
      role: validated.role,
    };

    const updatedUser = await users.findByIdAndUpdate(id, allowedUpdates, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await logActivity({
      userId: decoded.id,
      action: "update",
      entityType: "user",
      entityId: id,
      message: `Updated user ${validated.name}`,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/users/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
