import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import type { UserRole } from "../../generated/prisma/client";

export function authorize(...allowedRoles: UserRole[]) {
  return async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const user = request.user as {
      userId: string;
      email: string;
      role: UserRole;
    };

    if (!allowedRoles.includes(user.role)) {
      return reply.status(403).send({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action",
        },
      });
    }
  };
}