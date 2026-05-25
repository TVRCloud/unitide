import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import users from "@/models/users";
import { hashPassword } from "@/utils/password";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const user = await users.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(password);

    await users.findByIdAndUpdate(user._id, {
      password: hashed,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
    });

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/auth/reset-password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
