import type { FastifyInstance } from "fastify";
import * as inviteService from "./invite.service.js";

async function requireAuth(request: { user?: { id: string } }, reply: { status: (code: number) => { send: (body: unknown) => void } }) {
  if (!request.user) return reply.status(401).send({ error: "Unauthorized" });
}

export async function inviteRoutes(app: FastifyInstance) {
  app.post("/trips/:tripId/invite", { preHandler: requireAuth }, async (request, reply) => {
    const { tripId } = request.params as { tripId: string };
    const user = (request as { user?: { id: string } }).user!;
    const invite = await inviteService.generateInvite(tripId, user.id);
    return reply.status(201).send(invite);
  });

  app.get("/invite/:token", async (request, reply) => {
    const { token } = request.params as { token: string };
    const invite = await inviteService.validateInvite(token);
    if (!invite) return reply.status(404).send({ error: "Invalid or expired invite" });
    return reply.send({ trip: invite.trips, expiresAt: invite.expires_at });
  });

  app.post("/invite/:token/accept", { preHandler: requireAuth }, async (request, reply) => {
    const { token } = request.params as { token: string };
    const user = (request as { user?: { id: string } }).user;
    if (!user) return reply.status(401).send({ error: "Unauthorized" });
    try {
      const member = await inviteService.acceptInvite(token, user.id);
      return reply.status(201).send(member);
    } catch (e) {
      return reply.status(400).send({ error: (e as Error).message });
    }
  });
}
