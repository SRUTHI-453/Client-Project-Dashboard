"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
class ClientController {
    clientService;
    constructor(clientService) {
        this.clientService = clientService;
    }
    async create(request, reply) {
        const { name, email } = request.body;
        const client = await this.clientService.create(name, email);
        return reply.status(201).send({
            success: true,
            data: client,
        });
    }
    async findAll(_request, reply) {
        const clients = await this.clientService.findAll();
        return reply.send({
            success: true,
            data: clients,
        });
    }
    async findById(request, reply) {
        const { id } = request.params;
        try {
            const client = await this.clientService.findById(id);
            return reply.send({
                success: true,
                data: client,
            });
        }
        catch (error) {
            if (error instanceof Error &&
                error.message === "CLIENT_NOT_FOUND") {
                return reply.status(404).send({
                    success: false,
                    error: {
                        code: "CLIENT_NOT_FOUND",
                        message: "Client not found",
                    },
                });
            }
            throw error;
        }
    }
    async update(request, reply) {
        const { id } = request.params;
        const { name, email } = request.body;
        try {
            const client = await this.clientService.update(id, name, email);
            return reply.send({
                success: true,
                data: client,
            });
        }
        catch (error) {
            if (error instanceof Error &&
                error.message === "CLIENT_NOT_FOUND") {
                return reply.status(404).send({
                    success: false,
                    error: {
                        code: "CLIENT_NOT_FOUND",
                        message: "Client not found",
                    },
                });
            }
            throw error;
        }
    }
    async patch(request, reply) {
        const { id } = request.params;
        const data = request.body;
        try {
            const client = await this.clientService.patch(id, data);
            return reply.send({
                success: true,
                data: client,
            });
        }
        catch (error) {
            if (error instanceof Error &&
                error.message === "CLIENT_NOT_FOUND") {
                return reply.status(404).send({
                    success: false,
                    error: {
                        code: "CLIENT_NOT_FOUND",
                        message: "Client not found",
                    },
                });
            }
            throw error;
        }
    }
    async delete(request, reply) {
        const { id } = request.params;
        try {
            const result = await this.clientService.delete(id);
            return reply.send({
                success: true,
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error &&
                error.message === "CLIENT_NOT_FOUND") {
                return reply.status(404).send({
                    success: false,
                    error: {
                        code: "CLIENT_NOT_FOUND",
                        message: "Client not found",
                    },
                });
            }
            throw error;
        }
    }
}
exports.ClientController = ClientController;
