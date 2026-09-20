"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityController = void 0;
const activity_service_1 = require("./activity.service");
class ActivityController {
    fastify;
    service;
    constructor(fastify) {
        this.fastify = fastify;
        this.service = new activity_service_1.ActivityService(fastify);
    }
    async findByProject(request, reply) {
        const user = request.user;
        const { projectId } = request.params;
        const activities = await this.service.findByProject(projectId, user.userId, user.role);
        return reply.send({
            success: true,
            data: activities,
        });
    }
}
exports.ActivityController = ActivityController;
