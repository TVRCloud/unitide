/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Message } from "@/models/message";
import { authenticateUser } from "@/lib/authenticateUser";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    await connectDB();
    const { user: decoded, errorResponse } = await authenticateUser();
    if (errorResponse) return errorResponse;

    const { chatId } = await params;

    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
      async start(controller) {
        try {
          const changeStream = Message.collection.watch([
            {
              $match: {
                "fullDocument.chatId": new mongoose.Types.ObjectId(chatId),
                operationType: { $in: ["insert"] },
              },
            },
          ]);

          const handleChange = async (change: any) => {
            if (change.fullDocument) {
              const populatedMessage = await Message.findById(
                change.fullDocument._id
              ).populate("sender", "name avatar email");

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(populatedMessage)}\n\n`)
              );
            }
          };

          changeStream.on("change", handleChange);
          changeStream.on("error", (error) => {
            console.error("Stream error:", error);
            controller.close();
          });

          // Keep the connection alive
          const interval = setInterval(() => {
            controller.enqueue(encoder.encode(": heartbeat\n\n"));
          }, 30000);

          req.signal.addEventListener("abort", () => {
            clearInterval(interval);
            changeStream.close();
            controller.close();
          });
        } catch (error) {
          console.error("Stream setup error:", error);
          controller.close();
        }
      },
    });

    return new NextResponse(customReadable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("GET /api/chats/:chatId/messages/stream error:", error);
    return NextResponse.json(
      { error: "Failed to stream messages" },
      { status: 500 }
    );
  }
}
