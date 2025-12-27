import { Schema, model, models } from "mongoose";

const ErrorLogSchema = new Schema(
  {
    source: {
      type: String,
      enum: ["client", "server"],
      required: true,
    },

    route: { type: String },
    method: { type: String },

    message: {
      type: String,
      required: true,
    },

    stack: { type: String },
    status: { type: Number },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },

    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

ErrorLogSchema.index(
  { createdAt: -1 },
  { expireAfterSeconds: 60 * 60 * 24 * 14 }
);

export default models.ErrorLogs ||
  model("ErrorLogs", ErrorLogSchema, "errorLogs");
