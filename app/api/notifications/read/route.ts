import { requireAuth } from "@/lib/auth-guard";
import connectDB from "@/lib/mongodb";
import { NotificationRead } from "@/models/notification";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const userId = user.id;
    const { notificationId } = await req.json();

    if (!userId || !notificationId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await NotificationRead.updateOne(
      { userId, notificationId },
      { $set: { readAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
