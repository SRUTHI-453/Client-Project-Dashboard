import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { NotificationService } from "./notification.service";

export class NotificationController {
  private readonly service: NotificationService;

  constructor(private readonly fastify: FastifyInstance) {
    this.service = new NotificationService(fastify);
  }

  async findAll(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as {
      userId: string;
      email: string;
      role: string;
    };

    const notifications = await this.service.findAll(user.userId);

    return reply.send({
      success: true,
      data: notifications,
    });
  }

  async getUnreadCount(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as {
      userId: string;
      email: string;
      role: string;
    };

    const result = await this.service.getUnreadCount(user.userId);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async markAsRead(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as {
      userId: string;
      email: string;
      role: string;
    };

    const { id } = request.params as { id: string };

    try {
      const notification = await this.service.markAsRead(id, user.userId);

      return reply.send({
        success: true,
        data: notification,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "NOTIFICATION_NOT_FOUND") {
        return reply.status(404).send({
          success: false,
          error: {
            code: "NOTIFICATION_NOT_FOUND",
            message: "Notification not found",
          },
        });
      }
      throw error;
    }
  }

  async markAllAsRead(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as {
      userId: string;
      email: string;
      role: string;
    };

    const result = await this.service.markAllAsRead(user.userId);

    return reply.send({
      success: true,
      data: result,
    });
  }
}
