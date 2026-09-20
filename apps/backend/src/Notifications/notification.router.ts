import type { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/authenticate";
import { NotificationController } from "./notification.controller";

export async function notificationRoutes(
  fastify: FastifyInstance
) {
  const controller = new NotificationController(fastify);

  // Get all notifications
  fastify.get(
    "/notifications",
    {
      preHandler: [authenticate],
    },
    controller.findAll.bind(controller)
  );

  // Get unread notification count
  fastify.get(
    "/notifications/unread-count",
    {
      preHandler: [authenticate],
    },
    controller.getUnreadCount.bind(controller)
  );

  // Mark one notification as read
  fastify.patch(
    "/notifications/:id/read",
    {
      preHandler: [authenticate],
      schema: {
        params: {
          type: "object",
          required: ["id"],
          additionalProperties: false,
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
          },
        },
      },
    },
    controller.markAsRead.bind(controller)
  );

  // Mark all notifications as read
  fastify.patch(
    "/notifications/read-all",
    {
      preHandler: [authenticate],
    },
    controller.markAllAsRead.bind(controller)
  );
}