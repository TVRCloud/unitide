import { Schema, model, models } from "mongoose";

const MediaAttachmentSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["image", "video", "audio", "file"],
      required: true,
    },
    url: { type: String, required: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    thumbnail: { type: String },
    duration: { type: Number },
  },
  { _id: false }
);

const MessageSchema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chats",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    content: { type: String },
    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "file"],
      default: "text",
    },
    media: MediaAttachmentSchema,
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Messages",
    },
    forwardedFrom: {
      type: Schema.Types.ObjectId,
      ref: "Messages",
    },
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedFor: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  { timestamps: true }
);

// Indexes for performance
MessageSchema.index({ chatId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1 });
MessageSchema.index({ isDeleted: 1 });

export default models.Messages || model("Messages", MessageSchema, "messages");
