import { Schema, model, models } from "mongoose";

const SessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    jti: {
      type: String,
      required: true,
      unique: true,
    },

    refreshToken: {
      type: String,
      required: true,
    },

    tokenVersion: {
      type: Number,
      default: 1,
    },

    ip: { type: String },
    userAgent: { type: String },
    isActive: {
      type: Boolean,
      default: true,
    },
    loggedInAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// 🧹 Auto-delete sessions after 3 months (90 days)
SessionSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 90 }
);

export default models.UserSession ||
  model("UserSession", SessionSchema, "userSession");
