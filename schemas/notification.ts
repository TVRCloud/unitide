import { z } from "zod";

export const createNotificationSchema = z.object({
  type: z.enum(["BROADCAST", "ROLE_BASED", "DIRECT", "SYSTEM", "TASK"]),
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  audienceType: z.enum(["ALL", "ROLE", "USER"]),
  roles: z.array(z.string()).optional(),
  users: z.array(z.string()).optional(),
});

export type TCreateNotificationSchema = z.infer<
  typeof createNotificationSchema
>;
