import type { FastifyInstance } from "fastify";
import * as routeService from "./route.service.js";

async function requireAuth(request: { user?: { id: string } }, reply: { status: (code: number) => { send: (body: unknown) => void } }) {
  if (!request.user) return reply.status(401).send({ error: "Unauthorized" });
}

export async function routeRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/:tripId/route", async (request, reply) => {
    const { tripId } = request.params as { tripId: string };
    const route = await routeService.calculateTripRoute(tripId);
    return reply.send(route);
  });

  app.get("/:tripId/days/:dayId/route", async (request, reply) => {
    const { tripId, dayId } = request.params as { tripId: string; dayId: string };
    const route = await routeService.calculateDayRoute(tripId, dayId);
    return reply.send(route);
  });
}
