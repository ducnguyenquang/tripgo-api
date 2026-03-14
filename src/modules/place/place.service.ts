import { getSupabase } from "../../db/client.js";
import type { CreatePlaceInput, UpdatePlaceInput } from "./place.schema.js";

export async function addPlace(tripId: string, input: CreatePlaceInput) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("places")
    .insert({
      trip_id: tripId,
      name: input.name,
      description: input.description,
      type: input.type,
      latitude: input.latitude,
      longitude: input.longitude,
      address: input.address,
      google_place_id: input.googlePlaceId,
      image_url: input.imageUrl,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getPlaces(tripId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("trip_id", tripId);
  if (error) throw error;
  return data ?? [];
}

export async function updatePlace(id: string, input: UpdatePlaceInput) {
  const supabase = getSupabase();
  const payload: Record<string, unknown> = {};
  if (input.name != null) payload.name = input.name;
  if (input.description != null) payload.description = input.description;
  if (input.type != null) payload.type = input.type;
  if (input.latitude != null) payload.latitude = input.latitude;
  if (input.longitude != null) payload.longitude = input.longitude;
  if (input.address != null) payload.address = input.address;
  if (input.googlePlaceId != null) payload.google_place_id = input.googlePlaceId;
  if (input.imageUrl != null) payload.image_url = input.imageUrl;

  const { data, error } = await supabase
    .from("places")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePlace(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("places").delete().eq("id", id);
  if (error) throw error;
}
