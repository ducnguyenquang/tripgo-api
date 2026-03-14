import type { FastifyInstance } from "fastify";
import { z } from "zod";
import * as memberService from "./member.service.js";

const JoinSchema = z.object({ role: z.enum(["owner", "admin", "member"]).optional() });
const UpdateRoleSchema = z.object({ role: z.enum(["admin", "member"]) });

async function requireAuth(request: { user?: { id: string } }, reply: { status: (code: number) => { send: (body: unknown) => void } }) {
  if (!request.user) return reply.status(401).send({ error: "Unauthorized" });
}

export async function memberRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.post("/:tripId/join", async (request, reply) => {
    const { tripId } = request.params as { tripId: string };
    const parsed = JoinSchema.safeParse(request.body ?? {});
    const role = parsed.success ? (parsed.data.role ?? "member") : "member";
    const member = await memberService.joinTrip(tripId, request.user!.id, role);
    return reply.status(201).send(member);
  });

  app.post("/:tripId/leave", async (request, reply) => {
    const { tripId } = request.params as { tripId: string };
    await memberService.leaveTrip(tripId, request.user!.id);
    return reply.status(204).send();
  });

  app.get("/:tripId/members", async (request, reply) => {
    const { tripId } = request.params as { tripId: string };
    const members = await memberService.getMembers(tripId);
    return reply.send(members);
  });

  app.put("/:tripId/members/:userId/role", async (request, reply) => {
    const { tripId, userId } = request.params as { tripId: string; userId: string };
    const parsed = UpdateRoleSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send(parsed.error.flatten());
    try {
      const member = await memberService.updateRole(tripId, userId, parsed.data.role);
      return reply.send(member);
    } catch (e) {
      return reply.status(404).send({ error: "Member not found" });
    }
  });
}
