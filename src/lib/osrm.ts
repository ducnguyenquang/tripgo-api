const osrmUrl = process.env.OSRM_URL ?? "http://localhost:5000";

export interface RouteResult {
  distance: number;
  duration: number;
  polyline: string;
}

export async function getRoute(
  coordinates: Array<{ lat: number; lng: number }>
): Promise<RouteResult | null> {
  const coordsStr = coordinates.map((c) => `${c.lng},${c.lat}`).join(";");
  const url = `${osrmUrl}/route/v1/driving/${coordsStr}?overview=full&geometries=polyline`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = (await res.json()) as {
    routes?: Array<{
      distance: number;
      duration: number;
      geometry?: string;
    }>;
  };

  const route = data.routes?.[0];
  if (!route) return null;

  return {
    distance: route.distance,
    duration: route.duration,
    polyline: route.geometry ?? "",
  };
}
