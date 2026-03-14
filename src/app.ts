import { createServer } from "http";
import type { Server } from "http";
import Fastify from "fastify";
import multipart from "@fastify/multipart";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { registerCors } from "./plugins/cors.js";
import { registerAuth } from "./plugins/auth.js";
import { registerSocket } from "./plugins/socket.js";
import { tripRoutes } from "./modules/trip/trip.routes.js";
import { placeRoutes } from "./modules/place/place.routes.js";
import { dayRoutes } from "./modules/day/day.routes.js";
import { activityRoutes } from "./modules/activity/activity.routes.js";
import { memberRoutes } from "./modules/member/member.routes.js";
import { chatRoutes } from "./modules/chat/chat.routes.js";
import { billRoutes } from "./modules/bill/bill.routes.js";
import { routeRoutes } from "./modules/route/route.routes.js";
import { inviteRoutes } from "./modules/invite/invite.routes.js";

let httpServer: Server;

const serverFactory = (handler: (req: import("http").IncomingMessage, res: import("http").ServerResponse) => void) => {
  httpServer = createServer(handler);
  return httpServer;
};

export async function buildApp() {
  const app = Fastify({ logger: true, serverFactory });

  await registerCors(app);
  await app.register(multipart);
  await app.register(swagger, {
    openapi: {
      info: { title: "TripGo API", version: "1.0.0" },
    },
  });
  await app.register(swaggerUi, { routePrefix: "/docs" });
  await registerAuth(app);

  app.get("/health", async () => ({ status: "ok" }));

  await app.register(tripRoutes, { prefix: "/trips" });
  await app.register(placeRoutes, { prefix: "/trips" });
  await app.register(dayRoutes, { prefix: "/trips" });
  await app.register(activityRoutes);
  await app.register(memberRoutes, { prefix: "/trips" });
  await app.register(chatRoutes, { prefix: "/channels" });
  await app.register(billRoutes, { prefix: "/trips" });
  await app.register(routeRoutes, { prefix: "/trips" });
  await app.register(inviteRoutes);

  await app.ready();
  await registerSocket(app, httpServer!);

  return app;
}
