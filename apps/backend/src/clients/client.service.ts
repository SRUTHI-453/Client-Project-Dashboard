import type { FastifyInstance } from "fastify";

export class ClientService {
  constructor(private readonly fastify: FastifyInstance) {}

  async create(name: string, email?: string) {
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

  async findById(id: string) {
    const client = await this.fastify.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new Error("CLIENT_NOT_FOUND");
    }

    return client;
  }

  async update(
    id: string,
    name: string,
    email: string
  ) {
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

  async patch(
    id: string,
    data: {
      name?: string;
      email?: string;
    }
  ) {
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

  async delete(id: string) {
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