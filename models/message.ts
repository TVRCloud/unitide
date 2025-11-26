import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    content: String,
    attachments: [{ url: String, type: String, size: Number, name: String }],
    status: {
      type: String,
      enum: ["SENT", "DELIVERED", "READ"],
      default: "SENT",
    },
    meta: Schema.Types.Mixed,
    readBy: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    replyTo: { type: Schema.Types.ObjectId, ref: "Message" },
    reactions: [
      { emoji: String, userId: { type: Schema.Types.ObjectId, ref: "Users" } },
    ],
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

MessageSchema.index({ chatId: 1, createdAt: 1 });
MessageSchema.index({ sender: 1 });

export const Message = models.Message || model("Message", MessageSchema);
