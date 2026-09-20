"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("./notification.service");
class NotificationController {
    fastify;
    service;
    constructor(fastify) {
        this.fastify = fastify;
        this.service = new notification_service_1.NotificationService(fastify);
    }
    async findAll(request, reply) {
        const user = request.user;
        const notifications = await this.service.findAll(user.userId);
        return reply.send({
            success: true,
            data: notifications,
        });
    }
    async getUnreadCount(request, reply) {
        const user = request.user;
        const result = await this.service.getUnreadCount(user.userId);
        return reply.send({
            success: true,
            data: result,
        });
    }
    async markAsRead(request, reply) {
        const user = request.user;
        const { id } = request.params;
        try {
            const notification = await this.service.markAsRead(id, user.userId);
            return reply.send({
                success: true,
                data: notification,
            });
        }
        catch (error) {
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
    async markAllAsRead(request, reply) {
        const user = request.user;
        const result = await this.service.markAllAsRead(user.userId);
        return reply.send({
            success: true,
            data: result,
        });
    }
}
exports.NotificationController = NotificationController;
