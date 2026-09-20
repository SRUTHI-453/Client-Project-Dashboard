"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const emitters_1 = require("../sockets/emitters");
const notification_service_1 = require("../Notifications/notification.service");
class TaskService {
    fastify;
    notificationService;
    constructor(fastify) {
        this.fastify = fastify;
        this.notificationService = new notification_service_1.NotificationService(fastify);
    }
    async create(userId, role, data) {
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
    async findAll(userId, role) {
        let where = {};
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
    async findById(id, userId, role) {
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
    async logAndEmitStatusChange(updatedTask, userId, actorName, oldStatus, newStatus) {
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
        (0, emitters_1.emitActivityEvent)({
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
    async update(id, userId, role, data, actorName) {
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
            await this.logAndEmitStatusChange(updatedTask, userId, actorName, oldStatus, data.status);
        }
        return updatedTask;
    }
    async patch(id, userId, role, data, actorName) {
        const existingTask = await this.findById(id, userId, role);
        const oldStatus = existingTask.status;
        const updateData = {
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
            await this.logAndEmitStatusChange(updatedTask, userId, actorName, oldStatus, data.status);
        }
        return updatedTask;
    }
    async delete(id, userId, role) {
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
exports.TaskService = TaskService;
