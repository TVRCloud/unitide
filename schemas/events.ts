import { z } from "zod";

export const eventSchema = z
  .object({
    users: z
      .array(z.string())
      .min(1, { message: "At least one user is required" }),
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),

    startDate: z.coerce.date(),
    startTime: z.object({
      hour: z.number().int().min(0).max(23),
      minute: z.number().int().min(0).max(59),
    }),

    endDate: z.coerce.date(),
    endTime: z.object({
      hour: z.number().int().min(0).max(23),
      minute: z.number().int().min(0).max(59),
    }),

    color: z.enum([
      "blue",
      "green",
      "red",
      "yellow",
      "purple",
      "orange",
      "gray",
    ]),
  })
  .superRefine((data, ctx) => {
    const startDateTime = new Date(data.startDate);
    startDateTime.setHours(data.startTime.hour, data.startTime.minute, 0, 0);

    const endDateTime = new Date(data.endDate);
    endDateTime.setHours(data.endTime.hour, data.endTime.minute, 0, 0);

    if (startDateTime >= endDateTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start date cannot be after end date",
        path: ["startDate"],
      });
    }
  });

export type TEventFormData = z.infer<typeof eventSchema>;
