import { z } from "zod";

export const CreateTripSchema = z.object({
  name: z.string().min(1),
  destination: z.string().min(1),
  country: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export const UpdateTripSchema = CreateTripSchema.partial();

export type CreateTripInput = z.infer<typeof CreateTripSchema>;
export type UpdateTripInput = z.infer<typeof UpdateTripSchema>;
