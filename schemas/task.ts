import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  project: z.string().min(1),
  teams: z.array(z.string()).optional(),

  assignedTo: z.array(z.string()).optional(),
  watchers: z.array(z.string()).optional(),

  status: z
    .enum([
      "todo",
      "in-progress",
      "review",
      "completed",
      "blocked",
      "cancelled",
    ])
    .optional(),

  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),

  type: z.enum(["task", "bug", "story", "feature"]).optional(),

  storyPoints: z.number().optional(),
  sprint: z.string().optional(),

  tags: z.array(z.string()).optional(),
  colorLabel: z.string().optional(),

  dueDate: z.string().optional(),
  startDate: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type TCreateTaskSchema = z.infer<typeof createTaskSchema>;
export type TUpdateTaskSchema = z.infer<typeof updateTaskSchema>;
