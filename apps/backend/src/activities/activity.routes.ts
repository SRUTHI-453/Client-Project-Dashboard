import type { FastifyInstance } from "fastify";

import { authenticate } from "../middleware/authenticate";
import { ActivityController } from "./activity.controller";

export async function activityRoutes(
  fastify: FastifyInstance
) {
  const controller = new ActivityController(fastify);

  fastify.get(
    "/projects/:projectId/activities",
    {
      preHandler: [authenticate],
      schema: {
        params: {
          type: "object",
          required: ["projectId"],
          additionalProperties: false,
          properties: {
            projectId: {
              type: "string",
              format: "uuid",
            },
          },
        },
      },
    },
    controller.findByProject.bind(controller)
  );
}