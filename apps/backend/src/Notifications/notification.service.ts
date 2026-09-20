import type { FastifyInstance } from "fastify";

export class NotificationService {
  constructor(private readonly fastify: FastifyInstance) {}

  // Create a new notification
  async create(data: {
    userId: string;
    taskId?: string;
    projectId?: string;
    type: string;
    message: string;
  }) {
    return this.fastify.prisma.notification.create({
      data: {
        userId: data.userId,
        taskId: data.taskId,
        projectId: data.projectId,
        type: data.type as any,
        message: data.message,
      },
    });
  }

  // Get notifications for logged-in user
  async findAll(userId: string) {
    return this.fastify.prisma.notification.findMany({
      where: {
        userId,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Get unread notification count
  async getUnreadCount(userId: string) {
    const count = await this.fastify.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return {
      unreadCount: count,
    };
  }

  // Mark one notification as read
  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.fastify.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new Error("NOTIFICATION_NOT_FOUND");
    }

    return this.fastify.prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string) {
    const result = await this.fastify.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return {
      updatedCount: result.count,
    };
  }
}
