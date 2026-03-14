import { getSupabase } from "../../db/client.js";
import type { CreateBillInput } from "./bill.schema.js";

export async function createBill(tripId: string, input: CreateBillInput) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("bills")
    .insert({
      trip_id: tripId,
      description: input.description,
      amount: input.amount,
      currency: input.currency,
      paid_by: input.paidBy,
      split_between: input.splitBetween,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getBills(tripId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .eq("trip_id", tripId);
  if (error) throw error;
  return data ?? [];
}

export async function getBillSummary(tripId: string) {
  const bills = await getBills(tripId);
  const total = bills.reduce((sum, b) => sum + (b.amount ?? 0), 0);
  return { total, currency: bills[0]?.currency ?? "USD", count: bills.length };
}
