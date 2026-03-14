import { getSupabase } from "../../db/client.js";
import type { CreateTripInput, UpdateTripInput } from "./trip.schema.js";

export async function createTrip(userId: string, input: CreateTripInput) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("trips")
    .insert({
      name: input.name,
      destination: input.destination,
      country: input.country,
      start_date: input.startDate,
      end_date: input.endDate,
      owner_id: userId,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getTrips(userId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .or(`owner_id.eq.${userId},trip_members!inner(user_id.eq.${userId})`);
  if (error) throw error;
  return data ?? [];
}

export async function getTripById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("trips").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function updateTrip(id: string, input: UpdateTripInput) {
  const supabase = getSupabase();
  const payload: Record<string, unknown> = {};
  if (input.name != null) payload.name = input.name;
  if (input.destination != null) payload.destination = input.destination;
  if (input.country != null) payload.country = input.country;
  if (input.startDate != null) payload.start_date = input.startDate;
  if (input.endDate != null) payload.end_date = input.endDate;

  const { data, error } = await supabase
    .from("trips")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTrip(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("trips").delete().eq("id", id);
  if (error) throw error;
}
