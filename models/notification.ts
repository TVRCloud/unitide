import { Schema, models, model } from "mongoose";

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["BROADCAST", "ROLE_BASED", "DIRECT", "SYSTEM", "TASK"],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    audienceType: {
      type: String,
      enum: ["ALL", "ROLE", "USER"],
      required: true,
    },
    roles: [{ type: String }],
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    meta: { type: Schema.Types.Mixed },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ audienceType: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ roles: 1 });
notificationSchema.index({ users: 1 });

const notificationReadSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    notificationId: {
      type: Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
    },
    readAt: { type: Date, required: true },
  },
  { timestamps: true }
);

notificationReadSchema.index(
  { userId: 1, notificationId: 1 },
  { unique: true }
);
notificationReadSchema.index({ userId: 1, readAt: -1 });
notificationReadSchema.index({ createdAt: -1 });

export const Notification =
  models.Notification || model("Notification", notificationSchema);
export const NotificationRead =
  models.NotificationRead || model("NotificationRead", notificationReadSchema);
