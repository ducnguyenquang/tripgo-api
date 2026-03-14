import type { FastifyInstance } from "fastify";
import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { redis } from "../lib/redis.js";
import { supabase } from "../db/client.js";
import { registerChatGateway } from "../modules/chat/chat.gateway.js";
import { registerLocationGateway } from "../modules/location/location.gateway.js";

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
}

export async function registerSocket(app: FastifyInstance, httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CORS_ORIGIN ?? "*" },
  });

  const subClient = redis.duplicate();
  io.adapter(createAdapter(redis, subClient));

  io.use(async (socket, next) => {
    const token =
      socket.handshake.auth?.token ??
      socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) return next(new Error("Unauthorized"));

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) return next(new Error("Invalid token"));
    socket.data.userId = user.id;
    next();
  });

  io.on("connection", (socket) => {
    app.log.info({ socketId: socket.id, userId: socket.data.userId }, "Socket connected");
    socket.on("disconnect", () => {
      app.log.info({ socketId: socket.id }, "Socket disconnected");
    });
  });

  registerChatGateway(io);
  registerLocationGateway(io);

  app.decorate("io", io);
}
