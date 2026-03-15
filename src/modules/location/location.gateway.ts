import type { Server } from "socket.io";
import * as locationService from "./location.service.js";

const throttleMap = new Map<string, number>();
const THROTTLE_MS = 5000;

export function registerLocationGateway(io: Server) {
  io.on("connection", (socket) => {
    socket.on("join-trip", async (tripId: string) => {
      if (!tripId) return;
      socket.join(`trip:${tripId}`);
      socket.data.tripId = tripId;

      try {
        const locations = await locationService.getGroupLocations(tripId);
        socket.emit("location-snapshot", locations);
      } catch {
        // DB may not be available in dev; send empty snapshot
        socket.emit("location-snapshot", []);
      }
    });

    socket.on("leave-trip", (tripId: string) => {
      if (!tripId) return;
      socket.leave(`trip:${tripId}`);
    });

    socket.on("location-update", async (payload: { tripId: string; latitude: number; longitude: number }) => {
      const userId = socket.data.userId;
      if (!userId) return;

      const key = `${payload.tripId}:${userId}`;
      const now = Date.now();
      if ((throttleMap.get(key) ?? 0) + THROTTLE_MS > now) return;
      throttleMap.set(key, now);

      try {
        await locationService.updateLocation(
          payload.tripId,
          userId,
          payload.latitude,
          payload.longitude
        );
      } catch {
        // DB may not be available; still broadcast to room
      }

      io.to(`trip:${payload.tripId}`).emit("location-broadcast", {
        userId,
        displayName: socket.data.displayName ?? "Member",
        latitude: payload.latitude,
        longitude: payload.longitude,
        timestamp: now,
      });
    });

    socket.on("disconnect", () => {
      const tripId = socket.data.tripId;
      if (tripId) {
        socket.leave(`trip:${tripId}`);
      }
    });
  });
}
