import type { FastifyInstance } from "fastify";
import type { UserRole } from "../../generated/prisma/client";
import { emitActivityEvent } from "../sockets/emitters";
import { NotificationService } from "../Notifications/notification.service";

export class TaskService {
  private readonly notificationService: NotificationService;

  constructor(private readonly fastify: FastifyInstance) {
    this.notificationService = new NotificationService(fastify);
  }

  async create(
    userId: string,
    role: UserRole,
    data: {
      projectId: string;
      title: string;
      description?: string;
      assignedDeveloperId?: string;
      status?: any;
      priority?: any;
      dueDate?: string;
    }
  ) {
    const project = await this.fastify.prisma.project.findUnique({
      where: {
        id: data.projectId,
      },
    });

    if (!project) {
      throw new Error("PROJECT_NOT_FOUND");
    }

    // PM can only create tasks inside their own projects
    if (role === "PROJECT_MANAGER" && project.createdById !== userId) {
      throw new Error("FORBIDDEN");
    }

    // Validate developer if assigned
    if (data.assignedDeveloperId) {
      const developer = await this.fastify.prisma.user.findUnique({
        where: {
          id: data.assignedDeveloperId,
        },
      });

      if (!developer || developer.role !== "DEVELOPER") {
        throw new Error("INVALID_DEVELOPER");
      }
    }

    const task = await this.fastify.prisma.task.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        assignedDeveloperId: data.assignedDeveloperId,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
      include: {
        project: true,
        assignedDeveloper: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return task;
  }

  async findAll(userId: string, role: UserRole) {
    let where: any = {};

    if (role === "PROJECT_MANAGER") {
      where = {
        project: {
          createdById: userId,
        },
      };
    }

    if (role === "DEVELOPER") {
      where = {
        assignedDeveloperId: userId,
      };
    }

    return this.fastify.prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedDeveloper: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string, userId: string, role: UserRole) {
    const task = await this.fastify.prisma.task.findUnique({
      where: {
        id,
      },
      include: {
        project: true,
        assignedDeveloper: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        activities: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!task) {
      throw new Error("TASK_NOT_FOUND");
    }

    if (role === "ADMIN") {
      return task;
    }

    if (role === "PROJECT_MANAGER" && task.project.createdById !== userId) {
      throw new Error("FORBIDDEN");
    }

    if (role === "DEVELOPER" && task.assignedDeveloperId !== userId) {
      throw new Error("FORBIDDEN");
    }

    return task;
  }

  private async logAndEmitStatusChange(
    updatedTask: any,
    userId: string,
    actorName: string,
    oldStatus: any,
    newStatus: any
  ) {
    const activity = await this.fastify.prisma.activity.create({
      data: {
        projectId: updatedTask.projectId,
        taskId: updatedTask.id,
        userId,
        action: "STATUS_CHANGE",
        fromStatus: oldStatus,
        toStatus: newStatus,
      },
    });

    emitActivityEvent({
      id: activity.id,
      projectId: updatedTask.projectId,
      pmId: updatedTask.project.createdById,
      taskId: updatedTask.id,
      assignedDeveloperId: updatedTask.assignedDeveloperId ?? undefined,
      actorName,
      action: "STATUS_CHANGE",
      fromStatus: oldStatus,
      toStatus: newStatus,
      createdAt: activity.createdAt.toISOString(),
    });
  }

  async update(
    id: string,
    userId: string,
    role: UserRole,
    data: any,
    actorName: string
  ) {
    const existingTask = await this.findById(id, userId, role);
    const oldStatus = existingTask.status;

    const updatedTask = await this.fastify.prisma.task.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        description: data.description,
        assignedDeveloperId: data.assignedDeveloperId,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
      include: {
        project: true,
        assignedDeveloper: true,
      },
    });

    if (data.status && data.status !== oldStatus) {
      await this.logAndEmitStatusChange(
        updatedTask,
        userId,
        actorName,
        oldStatus,
        data.status
      );
    }

    return updatedTask;
  }

  async patch(
    id: string,
    userId: string,
    role: UserRole,
    data: any,
    actorName: string
  ) {
    const existingTask = await this.findById(id, userId, role);
    const oldStatus = existingTask.status;

    const updateData: any = {
      ...data,
    };

    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    const updatedTask = await this.fastify.prisma.task.update({
      where: {
        id,
      },
      data: updateData,
      include: {
        project: true,
        assignedDeveloper: true,
      },
    });

    if (data.status && data.status !== oldStatus) {
      await this.logAndEmitStatusChange(
        updatedTask,
        userId,
        actorName,
        oldStatus,
        data.status
      );
    }

    return updatedTask;
  }

  async delete(id: string, userId: string, role: UserRole) {
    await this.findById(id, userId, role);

    await this.fastify.prisma.task.delete({
      where: {
        id,
      },
    });

    return {
      message: "Task deleted successfully",
    };
  }
}