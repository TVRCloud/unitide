import z from "zod";

export const createChatSchema = z.object({
  title: z.string().optional(),
  type: z.enum(["GROUP", "DIRECT"]).default("DIRECT"),
  members: z.array(z.string()).min(1),
  admins: z.array(z.string()).optional(),
  avatar: z.string().optional(),
});
export type TCreateChatSchema = z.infer<typeof createChatSchema>;

export const sendMessageSchema = z.object({
  content: z.string().min(1),
  attachments: z
    .array(
      z.object({
        url: z.string(),
        type: z.string().optional(),
        name: z.string().optional(),
        size: z.number().optional(),
      })
    )
    .optional(),
  replyTo: z.string().optional(),
  meta: z.any().optional(),
});

export type TSendMessageSchema = z.infer<typeof sendMessageSchema>;
