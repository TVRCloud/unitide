/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import type {
  ChangeStreamInsertDocument,
  ChangeStreamUpdateDocument,
} from "mongodb";
import { Message } from "@/models/message";

type MessageChangeEvent =
  | ChangeStreamInsertDocument<any>
  | ChangeStreamUpdateDocument<any>;

function isInsertOrUpdateEvent(change: any): change is MessageChangeEvent {
  return change.operationType === "insert" || change.operationType === "update";
}

export async function* streamMessages(chatId: string) {
  const changeStream = Message.collection.watch([
    {
      $match: {
        "fullDocument.chatId": new mongoose.Types.ObjectId(chatId),
        operationType: { $in: ["insert", "update"] },
      },
    },
  ]);

  for await (const change of changeStream) {
    if (isInsertOrUpdateEvent(change) && change.fullDocument) {
      const populatedMessage = await Message.findById(
        change.fullDocument._id
      ).populate("sender", "name avatar email");
      yield populatedMessage;
    }
  }
}

export async function createChangeStream(
  onMessage: (message: any) => void,
  onError: (error: Error) => void,
  chatId: string
) {
  try {
    const changeStream = Message.collection.watch([
      {
        $match: {
          "fullDocument.chatId": new mongoose.Types.ObjectId(chatId),
          operationType: { $in: ["insert", "update"] },
        },
      },
    ]);

    changeStream.on("change", async (change: any) => {
      if (isInsertOrUpdateEvent(change) && change.fullDocument) {
        const populatedMessage = await Message.findById(
          change.fullDocument._id
        ).populate("sender", "name avatar email");
        onMessage(populatedMessage);
      }
    });

    changeStream.on("error", onError);

    return () => changeStream.close();
  } catch (error) {
    onError(error as Error);
  }
}
