import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import connectDB from "@/lib/mongodb";
import users from "@/models/users";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await users.findOne({ email: email.toLowerCase().trim() });

    // Always return 200 to avoid user enumeration
    if (!user) {
      return NextResponse.json(
        { message: "If that email exists, a reset link has been generated." },
        { status: 200 }
      );
    }

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await users.findByIdAndUpdate(user._id, {
      passwordResetToken: token,
      passwordResetExpires: expires,
    });

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password/${token}`;

    return NextResponse.json({ resetUrl }, { status: 200 });
  } catch (error) {
    console.error("POST /api/auth/forgot-password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
