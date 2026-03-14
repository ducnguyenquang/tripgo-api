import { supabase } from "../../db/client.js";

export type MemberStatus = "there" | "coming" | "lost";

const THERE_THRESHOLD_M = 100;
const COMING_THRESHOLD_M = 500;

export async function updateLocation(
  tripId: string,
  userId: string,
  latitude: number,
  longitude: number
) {
  const { data, error } = await supabase
    .from("member_locations")
    .upsert(
      {
        trip_id: tripId,
        user_id: userId,
        latitude,
        longitude,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "trip_id,user_id" }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getGroupLocations(tripId: string) {
  const { data, error } = await supabase
    .from("member_locations")
    .select("*")
    .eq("trip_id", tripId);
  if (error) throw error;
  return data ?? [];
}

export function calculateMemberStatus(
  memberLat: number,
  memberLng: number,
  targetLat: number,
  targetLng: number
): MemberStatus {
  const distanceM = haversineDistance(memberLat, memberLng, targetLat, targetLng);
  if (distanceM <= THERE_THRESHOLD_M) return "there";
  if (distanceM <= COMING_THRESHOLD_M) return "coming";
  return "lost";
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
