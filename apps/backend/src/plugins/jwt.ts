import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

export default fp(async (fastify) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is missing");
  }

  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
  });

  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_REFRESH_SECRET,
    namespace: "refreshJwt",
  });
});