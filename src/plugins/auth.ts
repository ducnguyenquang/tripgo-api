import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import { supabase } from "../db/client.js";

export interface AuthenticatedUser {
  id: string;
  email?: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}

async function authPlugin(app: FastifyInstance) {
  app.decorateRequest("user", undefined);

  app.addHook("preHandler", async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    if (!token) return;

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return;

    (request as FastifyRequest & { user: AuthenticatedUser }).user = {
      id: user.id,
      email: user.email,
    };
  });
}

export const registerAuth = fp(authPlugin);
