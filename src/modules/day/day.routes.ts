import type { FastifyInstance } from "fastify";
import { CreateDaySchema, UpdateDaySchema } from "./day.schema.js";
import * as dayService from "./day.service.js";

async function requireAuth(request: { user?: { id: string } }, reply: { status: (code: number) => { send: (body: unknown) => void } }) {
  if (!request.user) return reply.status(401).send({ error: "Unauthorized" });
}

export async function dayRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.post("/:tripId/days", async (request, reply) => {
    const { tripId } = request.params as { tripId: string };
    const parsed = CreateDaySchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send(parsed.error.flatten());
    const day = await dayService.createDay(tripId, parsed.data);
    return reply.status(201).send(day);
  });

  app.get("/:tripId/days", async (request, reply) => {
    const { tripId } = request.params as { tripId: string };
    const days = await dayService.getDays(tripId);
    return reply.send(days);
  });

  app.put("/:tripId/days/:id", async (request, reply) => {
    const { id } = request.params as { tripId: string; id: string };
    const parsed = UpdateDaySchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send(parsed.error.flatten());
    try {
      const day = await dayService.updateDay(id, parsed.data);
      return reply.send(day);
    } catch (e) {
      return reply.status(404).send({ error: "Day not found" });
    }
  });

  app.delete("/:tripId/days/:id", async (request, reply) => {
    const { id } = request.params as { tripId: string; id: string };
    try {
      await dayService.deleteDay(id);
      return reply.status(204).send();
    } catch (e) {
      return reply.status(404).send({ error: "Day not found" });
    }
  });
}
