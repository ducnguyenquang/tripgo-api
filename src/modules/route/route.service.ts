import { getRoute } from "../../lib/osrm.js";
import { getSupabase } from "../../db/client.js";

export async function calculateTripRoute(tripId: string) {
  const supabase = getSupabase();
  const { data: places } = await supabase
    .from("places")
    .select("latitude, longitude")
    .eq("trip_id", tripId)
    .order("created_at");

  if (!places || places.length < 2) {
    return { polyline: "", distance: 0, duration: 0 };
  }

  const coords = places.map((p) => ({ lat: p.latitude, lng: p.longitude }));
  const result = await getRoute(coords);
  return result ?? { polyline: "", distance: 0, duration: 0 };
}

export async function calculateDayRoute(tripId: string, dayId: string) {
  const supabase = getSupabase();
  const { data: activities } = await supabase
    .from("activities")
    .select("place_id, places(latitude, longitude)")
    .eq("day_id", dayId)
    .order("order");

  if (!activities || activities.length < 2) {
    return { polyline: "", distance: 0, duration: 0 };
  }

  const coords = activities
    .map((a: unknown) => {
      const row = a as { places?: { latitude: number; longitude: number } | { latitude: number; longitude: number }[] | null };
      const p = Array.isArray(row.places) ? row.places[0] : row.places;
      return p ? { lat: p.latitude, lng: p.longitude } : null;
    })
    .filter((c): c is { lat: number; lng: number } => c != null);

  const result = await getRoute(coords);
  return result ?? { polyline: "", distance: 0, duration: 0 };
}
