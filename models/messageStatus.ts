import { Schema, model, models } from "mongoose";

const MessageStatusSchema = new Schema(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Messages",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    deliveredAt: { type: Date },
    readAt: { type: Date },
  },
  { timestamps: true }
);

// Compound index for efficient queries
MessageStatusSchema.index({ messageId: 1, userId: 1 }, { unique: true });
MessageStatusSchema.index({ userId: 1, status: 1 });

export default models.MessageStatus ||
  model("MessageStatus", MessageStatusSchema, "message_status");
