import errorLogs from "@/models/errorLogs";
import { ErrorLogSchema } from "@/schemas/errorLog";

export const logServerError = async (payload: unknown): Promise<void> => {
  try {
    const parsed = ErrorLogSchema.safeParse(payload);
    if (!parsed.success) return;

    await errorLogs.create(parsed.data);
  } catch {}
};
