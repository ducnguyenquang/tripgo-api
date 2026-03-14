import { z } from "zod";

export const CreateMessageSchema = z.object({
  content: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
