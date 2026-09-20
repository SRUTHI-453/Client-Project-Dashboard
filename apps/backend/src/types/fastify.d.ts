import "@fastify/jwt";
import type { PrismaClient } from "../../generated/prisma/client";
import type { FastifyJwtNamespace } from "@fastify/jwt";

declare module "fastify" {
  interface FastifyInstance
    extends FastifyJwtNamespace<{
      namespace: "refreshJwt";
    }> {
    prisma: PrismaClient;
  }
}