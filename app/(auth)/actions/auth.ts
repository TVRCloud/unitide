"use server";

import connectDB from "@/lib/mongodb";
import users from "@/models/users";
import { hashPassword } from "@/utils/password";
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

  return { success: true, message: "Account created successfully" };
}
