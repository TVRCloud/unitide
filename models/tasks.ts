import { Schema, model, models } from "mongoose";

const ChecklistItemSchema = new Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: true }
);

const AttachmentSchema = new Schema(
  {
    name: String,
    url: String,
    size: Number,
    uploadedBy: { type: Schema.Types.ObjectId, ref: "Users" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const TaskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    project: { type: Schema.Types.ObjectId, ref: "Projects", required: true },
    teams: [{ type: Schema.Types.ObjectId, ref: "Teams" }],
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Users" },
    watchers: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    status: {
      type: String,
      enum: [
        "todo",
        "in-progress",
        "review",
        "completed",
        "blocked",
        "cancelled",
      ],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    type: {
      type: String,
      enum: ["task", "bug", "story", "feature"],
      default: "task",
    },
    // storyPoints: { type: Number },
    // sprint: { type: Schema.Types.ObjectId, ref: "Sprints" },
    tags: [{ type: String }],
    dueDate: { type: Date },
    startDate: { type: Date },
    completedAt: { type: Date },
    parentTask: { type: Schema.Types.ObjectId, ref: "Task" },
    subtasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    attachments: [AttachmentSchema],
    checklists: [ChecklistItemSchema],
    timeTracked: {
      type: Number,
      default: 0,
    },
    timeLogs: [
      {
        user: { type: Schema.Types.ObjectId, ref: "Users" },
        minutes: Number,
        note: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    recurring: {
      isRecurring: { type: Boolean, default: false },
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
      },
      interval: { type: Number, default: 1 },
      nextRun: { type: Date },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Task || model("Task", TaskSchema, "tasks");
