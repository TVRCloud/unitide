import { z } from "zod";

export const ErrorLogSchema = z.object({
  source: z.enum(["client", "server"]),
  route: z.string().optional(),
  method: z.string().optional(),
  message: z.string().max(500),
  stack: z.string().optional(),
  status: z.number().optional(),
  userId: z.string().optional(),
  metadata: z.any().optional(),
});

export type TErrorLogSchema = z.infer<typeof ErrorLogSchema>;
