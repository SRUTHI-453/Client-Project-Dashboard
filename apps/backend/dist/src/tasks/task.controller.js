"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const task_service_1 = require("./task.service");
class TaskController {
    fastify;
    service;
    constructor(fastify) {
        this.fastify = fastify;
        this.service = new task_service_1.TaskService(fastify);
    }
    async create(request, reply) {
        const user = request.user;
        const task = await this.service.create(user.userId, user.role, request.body);
        return reply.status(201).send({
            success: true,
            data: task,
        });
    }
    async findAll(request, reply) {
        const user = request.user;
        const tasks = await this.service.findAll(user.userId, user.role);
        return reply.send({
            success: true,
            data: tasks,
        });
    }
    async findById(request, reply) {
        const user = request.user;
        const { id } = request.params;
        const task = await this.service.findById(id, user.userId, user.role);
        return reply.send({
            success: true,
            data: task,
        });
    }
    async update(request, reply) {
        const user = request.user;
        const { id } = request.params;
        const task = await this.service.update(id, user.userId, user.role, request.body, user.name);
        return reply.send({
            success: true,
            data: task,
        });
    }
    async patch(request, reply) {
        const user = request.user;
        const { id } = request.params;
        const task = await this.service.patch(id, user.userId, user.role, request.body, user.name);
        return reply.send({
            success: true,
            data: task,
        });
    }
    async delete(request, reply) {
        const user = request.user;
        const { id } = request.params;
        const result = await this.service.delete(id, user.userId, user.role);
        return reply.send({
            success: true,
            data: result,
        });
    }
}
exports.TaskController = TaskController;
