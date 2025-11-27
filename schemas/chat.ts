import z from "zod";

export const createChatSchema = z.object({
  title: z.string().optional(),
  type: z.enum(["GROUP", "DIRECT"]).default("DIRECT"),
  members: z.array(z.string()).min(1),
  admins: z.array(z.string()).optional(),
  avatar: z.string().optional(),
  metadata: z.any().optional(),
});

export type TCreateChatSchema = z.infer<typeof createChatSchema>;
