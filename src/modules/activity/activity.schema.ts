import { z } from "zod";

export const CreateActivitySchema = z.object({
  placeId: z.string().uuid(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  notes: z.string().optional(),
});

export const UpdateActivitySchema = z.object({
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  notes: z.string().optional(),
});

export const ReorderActivitySchema = z.object({
  order: z.number().int().min(0),
});

export type CreateActivityInput = z.infer<typeof CreateActivitySchema>;
export type UpdateActivityInput = z.infer<typeof UpdateActivitySchema>;
