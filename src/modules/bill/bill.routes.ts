import type { FastifyInstance } from "fastify";
import { CreateBillSchema } from "./bill.schema.js";
import * as billService from "./bill.service.js";

async function requireAuth(request: { user?: { id: string } }, reply: { status: (code: number) => { send: (body: unknown) => void } }) {
  if (!request.user) return reply.status(401).send({ error: "Unauthorized" });
}

export async function billRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.post("/:tripId/bills", async (request, reply) => {
    const { tripId } = request.params as { tripId: string };
    const parsed = CreateBillSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send(parsed.error.flatten());
    const bill = await billService.createBill(tripId, parsed.data);
    return reply.status(201).send(bill);
  });

  app.get("/:tripId/bills", async (request, reply) => {
    const { tripId } = request.params as { tripId: string };
    const bills = await billService.getBills(tripId);
    return reply.send(bills);
  });

  app.get("/:tripId/bills/summary", async (request, reply) => {
    const { tripId } = request.params as { tripId: string };
    const summary = await billService.getBillSummary(tripId);
    return reply.send(summary);
  });
}
