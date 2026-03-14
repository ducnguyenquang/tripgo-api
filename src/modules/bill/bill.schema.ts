import { z } from "zod";

export const CreateBillSchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().length(3).default("USD"),
  paidBy: z.string().uuid(),
  splitBetween: z.array(z.string().uuid()).min(1),
});

export type CreateBillInput = z.infer<typeof CreateBillSchema>;
