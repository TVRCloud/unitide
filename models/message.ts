import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    content: { type: String },
    attachments: [{ url: String, type: String }],
    status: {
      type: String,
      enum: ["SENT", "DELIVERED", "READ"],
      default: "SENT",
    },
    meta: Schema.Types.Mixed,
    // add readBy array if needed for read receipts
    readBy: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  },
  { timestamps: true }
);

export const Message = models.Message || model("Message", MessageSchema);
