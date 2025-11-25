import { Schema, model, models } from "mongoose";

const ChatSchema = new Schema(
  {
    title: { type: String },
    type: { type: String, enum: ["GROUP", "DIRECT"], default: "DIRECT" },
    members: [{ type: Schema.Types.ObjectId, ref: "Users", required: true }],
    admins: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    avatar: String,
    metadata: Schema.Types.Mixed,
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Chat = models.Chat || model("Chat", ChatSchema);
