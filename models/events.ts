import { Schema, model, models } from "mongoose";

const COLORS = [
  "blue",
  "green",
  "red",
  "yellow",
  "purple",
  "orange",
  "gray",
] as const;

const EventSchema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "Users", required: true }],
    title: { type: String, required: true },
    description: { type: String, required: true },

    startDate: { type: Date, required: true },
    startTime: {
      hour: { type: Number, required: true, min: 0, max: 23 },
      minute: { type: Number, required: true, min: 0, max: 59 },
    },

    endDate: { type: Date, required: true },
    endTime: {
      hour: { type: Number, required: true, min: 0, max: 23 },
      minute: { type: Number, required: true, min: 0, max: 59 },
    },

    color: {
      type: String,
      enum: COLORS,
      default: () => COLORS[Math.floor(Math.random() * COLORS.length)],
    },
  },
  { timestamps: true }
);

export default models.Events || model("Events", EventSchema, "events");
