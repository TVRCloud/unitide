import { Schema, model, models } from "mongoose";

const WorkspaceSchema = new Schema(
  {
    orgName: { type: String, default: "My Organization" },
    timezone: { type: String, default: "UTC" },
    defaultPriority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    workingDays: {
      type: [Number],
      default: [1, 2, 3, 4, 5], // Mon–Fri
    },
    workingHours: {
      from: { type: Number, default: 8 },
      to: { type: Number, default: 17 },
    },
    maxFileSizeMB: { type: Number, default: 10 },
  },
  { timestamps: true }
);

export default models.Workspace || model("Workspace", WorkspaceSchema, "workspace");
