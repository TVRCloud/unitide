import { Schema, model, models } from "mongoose";

const TeamSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    lead: { type: Schema.Types.ObjectId, ref: "Users" },
    members: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

export default models.Teams || model("Teams", TeamSchema, "teams");
