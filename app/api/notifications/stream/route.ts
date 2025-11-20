/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Notification } from "@/models/notification";

export const GET = async () => {
  await connectDB();

  const changeStream = Notification.watch([], {
    fullDocument: "updateLookup",
  });

  const stream = new ReadableStream({
    start(controller) {
      changeStream.on("change", (change) => {
        const d = change.fullDocument;

        const payload = {
          id: d._id.toString(),
          title: d.title,
          body: d.body,
          createdAt: d.createdAt,
          type: d.type,
          audienceType: d.audienceType,
          roles: d.roles ?? [],
          users: d.users?.map((u: any) => u.toString()) ?? [],
        };

        controller.enqueue(`data: ${JSON.stringify(payload)}\n\n`);
      });

      changeStream.on("error", (err) => {
        console.error("ChangeStream error:", err);
        controller.close();
      });
    },

    cancel() {
      changeStream.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};
