import { z } from "zod";

export const eventSchema = z
  .object({
    user: z.string(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    startDate: z.date(),
    startTime: z.object({ hour: z.number(), minute: z.number() }),
    endDate: z.date(),
    endTime: z.object({ hour: z.number(), minute: z.number() }),
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
  .refine(
    (data) => {
      const startDateTime = new Date(data.startDate);
      startDateTime.setHours(data.startTime.hour, data.startTime.minute, 0, 0);

      const endDateTime = new Date(data.endDate);
      endDateTime.setHours(data.endTime.hour, data.endTime.minute, 0, 0);

      return startDateTime < endDateTime;
    },
    {
      message: "Start date cannot be after end date",
      path: ["startDate"],
    }
  );

export type TEventFormData = z.infer<typeof eventSchema>;
