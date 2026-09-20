import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("MISSING_TOKEN");
    }

    const token = authHeader.slice(7);

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };

    request.user = payload;
  } catch (err) {
    console.error("AUTH ERROR:", err); // TEMP DEBUG — remove after fixing
    return reply.status(401).send({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid or expired access token",
      },
    });
  }
}