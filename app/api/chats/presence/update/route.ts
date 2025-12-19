import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import users from "@/models/users";
import { type NextRequest, NextResponse } from "next/server";
import z from "zod";

const updatePresenceSchema = z.object({
  isOnline: z.boolean(),
});

/**
 * POST /api/presence/update - Update user's online status
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { user, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const body = await request.json();

    // Validate input
    const validation = updatePresenceSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
        },
        { status: 400 }
      );
    }

    const { isOnline } = validation.data;
    const userId = user.id;

    // Update user presence
    const updatedUser = await users.findByIdAndUpdate(userId, {
      isOnline,
      lastSeen: new Date(),
    });

    console.log(updatedUser);

    return NextResponse.json({
      success: true,
      message: "Presence updated",
    });
  } catch (error) {
    console.error("[Presence Update POST] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
