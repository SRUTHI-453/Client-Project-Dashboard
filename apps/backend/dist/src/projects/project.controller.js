"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
class ProjectController {
    projectService;
    constructor(projectService) {
        this.projectService = projectService;
    }
    async create(request, reply) {
        const { name, description, clientId } = request.body;
        const user = request.user;
        try {
            const project = await this.projectService.create(name, description, clientId, user.userId);
            return reply.status(201).send({ success: true, data: project });
        }
        catch (error) {
            if (error instanceof Error && error.message === "CLIENT_NOT_FOUND") {
                return reply.status(404).send({
                    success: false,
                    error: { code: "CLIENT_NOT_FOUND", message: "Client not found" },
                });
            }
            throw error;
        }
    }
    async findAll(request, reply) {
        const user = request.user;
        const projects = await this.projectService.findAll(user.userId, user.role);
        return reply.send({ success: true, data: projects });
    }
    async findById(request, reply) {
        const { id } = request.params;
        const user = request.user;
        try {
            const project = await this.projectService.findById(id, user.userId, user.role);
            return reply.send({ success: true, data: project });
        }
        catch (error) {
            return this.handleError(error, reply);
        }
    }
    async update(request, reply) {
        const { id } = request.params;
        const { name, description, clientId } = request.body;
        const user = request.user;
        try {
            const project = await this.projectService.update(id, user.userId, user.role, { name, description, clientId });
            return reply.send({ success: true, data: project });
        }
        catch (error) {
            return this.handleError(error, reply);
        }
    }
    async patch(request, reply) {
        const { id } = request.params;
        const data = request.body;
        const user = request.user;
        try {
            const project = await this.projectService.patch(id, user.userId, user.role, data);
            return reply.send({ success: true, data: project });
        }
        catch (error) {
            return this.handleError(error, reply);
        }
    }
    async delete(request, reply) {
        const { id } = request.params;
        const user = request.user;
        try {
            const result = await this.projectService.delete(id, user.userId, user.role);
            return reply.send({ success: true, data: result });
        }
        catch (error) {
            return this.handleError(error, reply);
        }
    }
    handleError(error, reply) {
        if (!(error instanceof Error))
            throw error;
        if (error.message === "PROJECT_NOT_FOUND") {
            return reply.status(404).send({
                success: false,
                error: { code: "PROJECT_NOT_FOUND", message: "Project not found" },
            });
        }
        if (error.message === "CLIENT_NOT_FOUND") {
            return reply.status(404).send({
                success: false,
                error: { code: "CLIENT_NOT_FOUND", message: "Client not found" },
            });
        }
        if (error.message === "FORBIDDEN") {
            return reply.status(403).send({
                success: false,
                error: { code: "FORBIDDEN", message: "You do not have access to this project" },
            });
        }
        throw error;
    }
}
exports.ProjectController = ProjectController;
