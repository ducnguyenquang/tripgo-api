import type { Server } from "socket.io";
import * as locationService from "./location.service.js";

const throttleMap = new Map<string, number>();
const THROTTLE_MS = 5000;

export function registerLocationGateway(io: Server) {
  io.on("connection", (socket) => {
    socket.on("location-update", async (payload: { tripId: string; latitude: number; longitude: number }) => {
      const userId = socket.data.userId;
      if (!userId) return;

      const key = `${payload.tripId}:${userId}`;
      const now = Date.now();
      if ((throttleMap.get(key) ?? 0) + THROTTLE_MS > now) return;
      throttleMap.set(key, now);

      await locationService.updateLocation(
        payload.tripId,
        userId,
        payload.latitude,
        payload.longitude
      );

      io.to(`trip:${payload.tripId}`).emit("location-broadcast", {
        userId,
        latitude: payload.latitude,
        longitude: payload.longitude,
      });
    });
  });
}
