import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import users from "@/models/users";
import { requireAuth } from "@/lib/auth-guard";

export async function GET() {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const user = await users.findById(decoded.id).select("preferences");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const prefs = user.preferences ?? {
      showProfile: true,
      activityLogs: true,
      emailNotifications: true,
      pushNotifications: true,
      hideOnlineStatus: false,
    };

    return NextResponse.json(prefs, { status: 200 });
  } catch (error) {
    console.error("GET /api/me/preferences error:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const allowed = [
      "showProfile",
      "activityLogs",
      "emailNotifications",
      "pushNotifications",
      "hideOnlineStatus",
    ];

    const updates: Record<string, boolean> = {};
    for (const key of allowed) {
      if (typeof body[key] === "boolean") {
        updates[`preferences.${key}`] = body[key];
      }
    }

    const user = await users.findByIdAndUpdate(
      decoded.id,
      { $set: updates },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.preferences, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/me/preferences error:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
