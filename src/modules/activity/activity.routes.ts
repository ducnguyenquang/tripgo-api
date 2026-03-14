import type { FastifyInstance } from "fastify";
import { CreateActivitySchema, UpdateActivitySchema, ReorderActivitySchema } from "./activity.schema.js";
import * as activityService from "./activity.service.js";

async function requireAuth(request: { user?: { id: string } }, reply: { status: (code: number) => { send: (body: unknown) => void } }) {
  if (!request.user) return reply.status(401).send({ error: "Unauthorized" });
}

export async function activityRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.post("/days/:dayId/activities", async (request, reply) => {
    const { dayId } = request.params as { dayId: string };
    const parsed = CreateActivitySchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send(parsed.error.flatten());
    const activity = await activityService.addActivity(dayId, parsed.data);
    return reply.status(201).send(activity);
  });

  app.put("/activities/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsed = UpdateActivitySchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send(parsed.error.flatten());
    try {
      const activity = await activityService.updateActivity(id, parsed.data);
      return reply.send(activity);
    } catch (e) {
      return reply.status(404).send({ error: "Activity not found" });
    }
  });

  app.delete("/activities/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await activityService.removeActivity(id);
      return reply.status(204).send();
    } catch (e) {
      return reply.status(404).send({ error: "Activity not found" });
    }
  });

  app.put("/activities/:id/reorder", async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsed = ReorderActivitySchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send(parsed.error.flatten());
    try {
      const activity = await activityService.reorderActivities(id, parsed.data.order);
      return reply.send(activity);
    } catch (e) {
      return reply.status(404).send({ error: "Activity not found" });
    }
  });
}
