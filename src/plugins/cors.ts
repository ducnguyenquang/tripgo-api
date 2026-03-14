import type { FastifyInstance } from "fastify";

export async function registerCors(app: FastifyInstance) {
  const origin = process.env.CORS_ORIGIN ?? "*";
  await app.register(import("@fastify/cors"), {
    origin: origin === "*" ? true : origin.split(",").map((o) => o.trim()),
    credentials: true,
  });
}
