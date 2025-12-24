import { authenticateUser } from "@/lib/authenticateUser";
import connectDB from "@/lib/mongodb";
import events from "@/models/events";
import { logActivity } from "@/utils/logger";
import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   try {
//     await connectDB()

//     const { errorResponse } = await authenticateUser([
//       "admin",
//       "manager",
//     ])
//     if (errorResponse) return errorResponse

//     const { searchParams } = new URL(request.url)

//     const skip = parseInt(searchParams.get("skip") || "0")
//     const limit = parseInt(searchParams.get("limit") || "10")
//     const search = searchParams.get("search") || ""

//     const query = search
//       ? {
//           $or: [
//             { title: { $regex: search, $options: "i" } },
//             { description: { $regex: search, $options: "i" } },
//           ],
//         }
//       : {}

//     const events = await Events.find(query)
//       .populate("users", "name email")
//       .sort({ startDate: 1 })
//       .skip(skip)
//       .limit(limit)
//       .lean()

//     return NextResponse.json(events, { status: 200 })
//   } catch (error) {
//     console.error("GET /api/events error:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch events" },
//       { status: 500 }
//     )
//   }
// }

export async function POST(request: Request) {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const body = await request.json();

    const newEvent = await events.create({
      ...body,
    });

    await logActivity({
      userId: decoded.id.toString(),
      action: "create",
      entityType: "task",
      entityId: newEvent._id.toString(),
      message: `Created event "${body.title}"`,
      metadata: {
        title: body.title,
        startDate: body.startDate,
        endDate: body.endDate,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
