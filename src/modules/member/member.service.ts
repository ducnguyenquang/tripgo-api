import { supabase } from "../../db/client.js";

export type MemberRole = "owner" | "admin" | "member";

export async function joinTrip(tripId: string, userId: string, role: MemberRole = "member") {
  const { data, error } = await supabase
    .from("trip_members")
    .insert({ trip_id: tripId, user_id: userId, role })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function leaveTrip(tripId: string, userId: string) {
  const { error } = await supabase
    .from("trip_members")
    .delete()
    .eq("trip_id", tripId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function getMembers(tripId: string) {
  const { data, error } = await supabase
    .from("trip_members")
    .select("*, users:user_id(id, email)")
    .eq("trip_id", tripId);
  if (error) throw error;
  return data ?? [];
}

export async function updateRole(tripId: string, userId: string, role: MemberRole) {
  const { data, error } = await supabase
    .from("trip_members")
    .update({ role })
    .eq("trip_id", tripId)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
