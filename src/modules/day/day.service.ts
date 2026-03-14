import { supabase } from "../../db/client.js";
import type { CreateDayInput, UpdateDayInput } from "./day.schema.js";

export async function createDay(tripId: string, input: CreateDayInput) {
  const { data, error } = await supabase
    .from("days")
    .insert({
      trip_id: tripId,
      date: input.date,
      title: input.title,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getDays(tripId: string) {
  const { data, error } = await supabase
    .from("days")
    .select("*, activities(*)")
    .eq("trip_id", tripId)
    .order("date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function updateDay(id: string, input: UpdateDayInput) {
  const payload: Record<string, unknown> = {};
  if (input.date != null) payload.date = input.date;
  if (input.title != null) payload.title = input.title;

  const { data, error } = await supabase
    .from("days")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDay(id: string) {
  const { error } = await supabase.from("days").delete().eq("id", id);
  if (error) throw error;
}
