import z from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
  teams: z.array(z.string()).optional(),
  members: z.array(z.string()).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  manager: z.string().optional(),
});

export type TCreateProjectSchema = z.infer<typeof createProjectSchema>;
