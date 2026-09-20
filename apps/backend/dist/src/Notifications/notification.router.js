"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = notificationRoutes;
const authenticate_1 = require("../middleware/authenticate");
const notification_controller_1 = require("./notification.controller");
async function notificationRoutes(fastify) {
    const controller = new notification_controller_1.NotificationController(fastify);
    // Get all notifications
    fastify.get("/notifications", {
        preHandler: [authenticate_1.authenticate],
    }, controller.findAll.bind(controller));
    // Get unread notification count
    fastify.get("/notifications/unread-count", {
        preHandler: [authenticate_1.authenticate],
    }, controller.getUnreadCount.bind(controller));
    // Mark one notification as read
    fastify.patch("/notifications/:id/read", {
        preHandler: [authenticate_1.authenticate],
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
    }, controller.markAsRead.bind(controller));
    // Mark all notifications as read
    fastify.patch("/notifications/read-all", {
        preHandler: [authenticate_1.authenticate],
    }, controller.markAllAsRead.bind(controller));
}
