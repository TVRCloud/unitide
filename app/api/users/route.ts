import { NextResponse } from "next/server";
import { hashPassword } from "@/utils/auth";
import connectDB from "@/lib/mongodb";
import users from "@/models/users";
import { SignupSchema } from "@/schemas/auth";
import { logActivity } from "@/utils/logger";
import { authenticateUser } from "@/lib/authenticateUser";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { errorResponse } = await authenticateUser(["admin", "manager"]);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);

    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            {
              email: { $regex: search, $options: "i" },
            },
          ],
        }
      : {};

    const userList = await users.find(query).skip(skip).limit(limit).lean();

    return NextResponse.json(userList, { status: 200 });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await authenticateUser([
      "admin",
      "manager",
    ]);
    if (errorResponse) return errorResponse;

    const body = await request.json();

    const validated = SignupSchema.parse(body);

    const existingUser = await users.findOne({ email: validated.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(validated.password);

    const newUser = await users.create({
      ...validated,
      password: hashedPassword,
    });
    const userResponse = newUser.toObject();
    delete userResponse.password;

    await logActivity({
      userId: decoded.id.toString(),
      action: "create",
      entityType: "user",
      entityId: newUser._id.toString(),
      message: `Created user ${validated.email}`,
      metadata: { email: validated.email, role: validated.role },
    });

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
