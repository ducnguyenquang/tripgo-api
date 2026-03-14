import type { FastifyInstance } from "fastify";
import { CreatePlaceSchema, UpdatePlaceSchema } from "./place.schema.js";
import * as placeService from "./place.service.js";

async function requireAuth(request: { user?: { id: string } }, reply: { status: (code: number) => { send: (body: unknown) => void } }) {
  if (!request.user) return reply.status(401).send({ error: "Unauthorized" });
}

export async function placeRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.post("/:tripId/places", async (request, reply) => {
    const { tripId } = request.params as { tripId: string };
    const parsed = CreatePlaceSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send(parsed.error.flatten());
    const place = await placeService.addPlace(tripId, parsed.data);
    return reply.status(201).send(place);
  });

  app.get("/:tripId/places", async (request, reply) => {
    const { tripId } = request.params as { tripId: string };
    const places = await placeService.getPlaces(tripId);
    return reply.send(places);
  });

  app.put("/:tripId/places/:id", async (request, reply) => {
    const { id } = request.params as { tripId: string; id: string };
    const parsed = UpdatePlaceSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send(parsed.error.flatten());
    try {
      const place = await placeService.updatePlace(id, parsed.data);
      return reply.send(place);
    } catch (e) {
      return reply.status(404).send({ error: "Place not found" });
    }
  });

  app.delete("/:tripId/places/:id", async (request, reply) => {
    const { id } = request.params as { tripId: string; id: string };
    try {
      await placeService.deletePlace(id);
      return reply.status(204).send();
    } catch (e) {
      return reply.status(404).send({ error: "Place not found" });
    }
  });
}
