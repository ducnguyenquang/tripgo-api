import type { FastifyInstance } from "fastify";
import { CreateTripSchema, UpdateTripSchema } from "./trip.schema.js";
import * as tripService from "./trip.service.js";

async function requireAuth(request: { user?: { id: string } }, reply: { status: (code: number) => { send: (body: unknown) => void } }) {
  if (!request.user) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
}

export async function tripRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.post("/", async (request, reply) => {
    const parsed = CreateTripSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send(parsed.error.flatten());
    const trip = await tripService.createTrip(request.user!.id, parsed.data);
    return reply.status(201).send(trip);
  });

  app.get("/", async (request, reply) => {
    const trips = await tripService.getTrips(request.user!.id);
    return reply.send(trips);
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const trip = await tripService.getTripById(id);
      return reply.send(trip);
    } catch (e) {
      return reply.status(404).send({ error: "Trip not found" });
    }
  });

  app.put("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsed = UpdateTripSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send(parsed.error.flatten());
    try {
      const trip = await tripService.updateTrip(id, parsed.data);
      return reply.send(trip);
    } catch (e) {
      return reply.status(404).send({ error: "Trip not found" });
    }
  });

  app.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await tripService.deleteTrip(id);
      return reply.status(204).send();
    } catch (e) {
      return reply.status(404).send({ error: "Trip not found" });
    }
  });
}
