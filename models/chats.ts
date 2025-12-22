import { Schema, model, models } from "mongoose";

const ChatSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["private", "group"],
      required: true,
    },
    name: { type: String }, // Required for group chats
    avatar: { type: String },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
    ],
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Messages",
    },
    lastMessageAt: { type: Date },
    isArchived: {
      type: Map,
      of: Boolean,
      default: {},
    },
    isMuted: {
      type: Map,
      of: Boolean,
      default: {},
    },
  },
  { timestamps: true }
);

ChatSchema.index({ participants: 1 });
ChatSchema.index({ type: 1 });
ChatSchema.index({ lastMessageAt: -1 });

// Compound index for private chat lookups
ChatSchema.index({ type: 1, participants: 1 });

export default models.Chats || model("Chats", ChatSchema, "chats");
