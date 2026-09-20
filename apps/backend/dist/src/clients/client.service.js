"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
class ClientService {
    fastify;
    constructor(fastify) {
        this.fastify = fastify;
    }
    async create(name, email) {
        return this.fastify.prisma.client.create({
            data: {
                name,
                email,
            },
        });
    }
    async findAll() {
        return this.fastify.prisma.client.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async findById(id) {
        const client = await this.fastify.prisma.client.findUnique({
            where: { id },
        });
        if (!client) {
            throw new Error("CLIENT_NOT_FOUND");
        }
        return client;
    }
    async update(id, name, email) {
        const client = await this.fastify.prisma.client.findUnique({
            where: { id },
        });
        if (!client) {
            throw new Error("CLIENT_NOT_FOUND");
        }
        return this.fastify.prisma.client.update({
            where: { id },
            data: {
                name,
                email,
            },
        });
    }
    async patch(id, data) {
        const client = await this.fastify.prisma.client.findUnique({
            where: { id },
        });
        if (!client) {
            throw new Error("CLIENT_NOT_FOUND");
        }
        return this.fastify.prisma.client.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        const client = await this.fastify.prisma.client.findUnique({
            where: { id },
        });
        if (!client) {
            throw new Error("CLIENT_NOT_FOUND");
        }
        await this.fastify.prisma.client.delete({
            where: { id },
        });
        return {
            message: "Client deleted successfully",
        };
    }
}
exports.ClientService = ClientService;
