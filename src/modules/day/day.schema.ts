import { z } from "zod";

export const CreateDaySchema = z.object({
  date: z.string().datetime(),
  title: z.string().optional(),
});

export const UpdateDaySchema = CreateDaySchema.partial();

export type CreateDayInput = z.infer<typeof CreateDaySchema>;
export type UpdateDayInput = z.infer<typeof UpdateDaySchema>;
