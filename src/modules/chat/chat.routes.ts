import type { FastifyInstance } from "fastify";
import { CreateMessageSchema } from "./chat.schema.js";
import * as chatService from "./chat.service.js";

async function requireAuth(request: { user?: { id: string } }, reply: { status: (code: number) => { send: (body: unknown) => void } }) {
  if (!request.user) return reply.status(401).send({ error: "Unauthorized" });
}

export async function chatRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/:channelId/messages", async (request, reply) => {
    const { channelId } = request.params as { channelId: string };
    const cursor = (request.query as { cursor?: string }).cursor;
    const limit = parseInt((request.query as { limit?: string }).limit ?? "50", 10);
    const messages = await chatService.getMessages(channelId, cursor, limit);
    return reply.send(messages);
  });

  app.post("/:channelId/messages", async (request, reply) => {
    const { channelId } = request.params as { channelId: string };
    const parsed = CreateMessageSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send(parsed.error.flatten());
    const message = await chatService.createMessage(channelId, request.user!.id, parsed.data);
    return reply.status(201).send(message);
  });
}
