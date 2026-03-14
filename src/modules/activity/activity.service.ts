import { getSupabase } from "../../db/client.js";
import type { CreateActivityInput, UpdateActivityInput } from "./activity.schema.js";

export async function addActivity(dayId: string, input: CreateActivityInput) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("activities")
    .insert({
      day_id: dayId,
      place_id: input.placeId,
      start_time: input.startTime,
      end_time: input.endTime,
      notes: input.notes,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateActivity(id: string, input: UpdateActivityInput) {
  const supabase = getSupabase();
  const payload: Record<string, unknown> = {};
  if (input.startTime != null) payload.start_time = input.startTime;
  if (input.endTime != null) payload.end_time = input.endTime;
  if (input.notes != null) payload.notes = input.notes;

  const { data, error } = await supabase
    .from("activities")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeActivity(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderActivities(id: string, order: number) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("activities")
    .update({ order })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
