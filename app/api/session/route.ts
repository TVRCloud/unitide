import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import userSession from "@/models/session";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { errorResponse } = await authenticateUser(["admin"]);
    if (errorResponse) return errorResponse;

    await userSession.updateMany(
      { expiresAt: { $lte: new Date() }, isActive: true },
      { $set: { isActive: false } }
    );

    const { searchParams } = new URL(request.url);

    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const sessions = await userSession.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [
            { $project: { password: 0, __v: 0, createdAt: 0, updatedAt: 0 } },
          ],
        },
      },
      { $unwind: "$user" },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return NextResponse.json(sessions, { status: 200 });
  } catch (error) {
    console.error("GET /api/session error:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}
