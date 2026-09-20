import Fastify from "fastify";
import cors from "@fastify/cors";

import prismaPlugin from "./plugins/prisma";
import cookiePlugin from "./plugins/cookie";
import jwtPlugin from "./plugins/jwt";

import { authRoutes } from "./auth/auth.routes";
import { clientRoutes } from "./clients/client.routes";
import { projectRoutes } from "./projects/project.routes";
import { taskRoutes } from "./tasks/task.routes";
import { activityRoutes } from "./activities/activity.routes";
import { notificationRoutes } from "./Notifications/notification.router";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  await app.register(prismaPlugin);
  await app.register(cookiePlugin);
  await app.register(jwtPlugin);

  app.get("/health", async (_request, reply) => {
    return reply.code(200).send({
      status: "ok",
    });
  });

  await app.register(authRoutes, {
    prefix: "/api/auth",
  });

  await app.register(clientRoutes, {
    prefix: "/api",
  });

  await app.register(projectRoutes, {
    prefix: "/api",
  });

  await app.register(taskRoutes, {
    prefix: "/api",
  });

  await app.register(activityRoutes, {
    prefix: "/api",
  });

  await app.register(notificationRoutes, {
    prefix: "/api",
  });

  return app;
}
