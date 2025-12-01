/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import users from "@/models/users";
import { authenticateUser } from "@/lib/authenticateUser";
import { getSignedUrl, uploadFile } from "@/lib/supabase";

export async function GET() {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const user = await users.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (user.avatar) {
      const signedUrl = await getSignedUrl(user.avatar);
      user.avatar = signedUrl || null;
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("GET /api/me error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const form = await request.formData();
    const name = form.get("name") as string | null;
    const avatar = form.get("avatar") as File | null;

    const updates: any = {};

    if (name) updates.name = name;

    if (avatar) {
      const uploaded = await uploadFile("users", avatar);
      if (uploaded.error) {
        return NextResponse.json({ error: uploaded }, { status: 500 });
      }
      updates.avatar = uploaded.fileName;
    }

    const updatedUser = await users.findByIdAndUpdate(decoded.id, updates, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser.toObject
      ? updatedUser.toObject()
      : updatedUser;

    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/me error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
