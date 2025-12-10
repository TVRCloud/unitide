"use server";

import connectDB from "@/lib/mongodb";
import users from "@/models/users";
import {
  clearSession,
  hashPassword,
  setSession,
  verifyPassword,
} from "@/utils/auth";
import { logActivity } from "@/utils/logger";

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string)?.toLowerCase();
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { message: "Name, email, and password are required" };
  }

  await connectDB();
  const existingUser = await users.findOne({ email });

  if (existingUser) {
    return { message: "User already exists" };
  }

  const hashedPassword = await hashPassword(password);
  const user = await users.create({
    name,
    email,
    password: hashedPassword,
    role: "guest",
  });

  await logActivity({
    userId: user._id.toString(),
    action: "create",
    entityType: "user",
    entityId: user._id.toString(),
    message: `${user.email} registered`,
  });

  // Set session (saves access + refresh token cookies)
  await setSession(user);

  return { success: true, message: "Account created successfully" };
}

export async function loginAction(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.toLowerCase();
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { message: "Email and password are required" };
    }

    await connectDB();

    const user = await users.findOne({ email });
    if (!user) {
      return { message: "User not found" };
    }

    const isValid = await verifyPassword(password, user.password.trim());
    if (!isValid) {
      return { message: "Invalid password" };
    }

    // Set session (saves access + refresh token cookies)
    await setSession(user);

    await logActivity({
      userId: user._id.toString(),
      action: "login",
      entityType: "user",
      entityId: user._id.toString(),
      message: `${user.email} logged in`,
    });

    return { success: true, message: "Login successful" };
  } catch (error) {
    console.error("Login error:", error);
    return { message: "Internal server error" };
  }
}

export async function logoutAction() {
  await clearSession();
}
