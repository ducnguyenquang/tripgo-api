import { z } from "zod";

export const CreatePlaceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["visit", "eat", "rest"]),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
  googlePlaceId: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export const UpdatePlaceSchema = CreatePlaceSchema.partial();

export type CreatePlaceInput = z.infer<typeof CreatePlaceSchema>;
export type UpdatePlaceInput = z.infer<typeof UpdatePlaceSchema>;
