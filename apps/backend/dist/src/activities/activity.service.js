"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
class ActivityService {
    fastify;
    constructor(fastify) {
        this.fastify = fastify;
    }
    async create(data) {
        return this.fastify.prisma.activity.create({
            data: {
                projectId: data.projectId,
                taskId: data.taskId,
                userId: data.userId,
                action: data.action,
                fromStatus: data.fromStatus,
                toStatus: data.toStatus,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async findByProject(projectId, userId, role) {
        const project = await this.fastify.prisma.project.findUnique({
            where: {
                id: projectId,
            },
        });
        if (!project) {
            throw new Error("PROJECT_NOT_FOUND");
        }
        if (role === "PROJECT_MANAGER" &&
            project.createdById !== userId) {
            throw new Error("FORBIDDEN");
        }
        if (role === "DEVELOPER") {
            throw new Error("FORBIDDEN");
        }
        return this.fastify.prisma.activity.findMany({
            where: {
                projectId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                task: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}
exports.ActivityService = ActivityService;
