"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const prisma_1 = __importDefault(require("./plugins/prisma"));
const cookie_1 = __importDefault(require("./plugins/cookie"));
const jwt_1 = __importDefault(require("./plugins/jwt"));
const auth_routes_1 = require("./auth/auth.routes");
const client_routes_1 = require("./clients/client.routes");
const project_routes_1 = require("./projects/project.routes");
const task_routes_1 = require("./tasks/task.routes");
const activity_routes_1 = require("./activities/activity.routes");
const notification_router_1 = require("./Notifications/notification.router");
async function buildApp() {
    const app = (0, fastify_1.default)({
        logger: true,
    });
    await app.register(cors_1.default, {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    });
    await app.register(prisma_1.default);
    await app.register(cookie_1.default);
    await app.register(jwt_1.default);
    app.get("/health", async (_request, reply) => {
        return reply.code(200).send({
            status: "ok",
        });
    });
    await app.register(auth_routes_1.authRoutes, {
        prefix: "/api/auth",
    });
    await app.register(client_routes_1.clientRoutes, {
        prefix: "/api",
    });
    await app.register(project_routes_1.projectRoutes, {
        prefix: "/api",
    });
    await app.register(task_routes_1.taskRoutes, {
        prefix: "/api",
    });
    await app.register(activity_routes_1.activityRoutes, {
        prefix: "/api",
    });
    await app.register(notification_router_1.notificationRoutes, {
        prefix: "/api",
    });
    return app;
}
