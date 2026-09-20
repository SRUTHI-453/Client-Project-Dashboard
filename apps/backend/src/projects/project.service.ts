import type { FastifyInstance } from "fastify";

export class ProjectService {
  constructor(private readonly fastify: FastifyInstance) {}

  async create(
    name: string,
    description: string | undefined,
    clientId: string,
    createdById: string
  ) {
    const client = await this.fastify.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error("CLIENT_NOT_FOUND");
    }

    return this.fastify.prisma.project.create({
      data: { name, description, clientId, createdById },
      include: {
        client: true,
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }

  async findAll(userId: string, role: string) {
    const where = role === "ADMIN" ? {} : { createdById: userId };

    return this.fastify.prisma.project.findMany({
      where,
      include: {
        client: true,
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        _count: { select: { tasks: true, activities: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string, userId: string, role: string) {
    const project = await this.fastify.prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        tasks: true,
      },
    });

    if (!project) {
      throw new Error("PROJECT_NOT_FOUND");
    }

    if (role !== "ADMIN" && project.createdById !== userId) {
      throw new Error("FORBIDDEN");
    }

    return project;
  }

  async update(
    id: string,
    userId: string,
    role: string,
    data: { name: string; description: string; clientId: string }
  ) {
    const project = await this.fastify.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new Error("PROJECT_NOT_FOUND");
    }

    if (role !== "ADMIN" && project.createdById !== userId) {
      throw new Error("FORBIDDEN");
    }

    const client = await this.fastify.prisma.client.findUnique({
      where: { id: data.clientId },
    });

    if (!client) {
      throw new Error("CLIENT_NOT_FOUND");
    }

    return this.fastify.prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        clientId: data.clientId,
      },
      include: {
        client: true,
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }

  async patch(
    id: string,
    userId: string,
    role: string,
    data: { name?: string; description?: string; clientId?: string }
  ) {
    const project = await this.fastify.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new Error("PROJECT_NOT_FOUND");
    }

    if (role !== "ADMIN" && project.createdById !== userId) {
      throw new Error("FORBIDDEN");
    }

    if (data.clientId) {
      const client = await this.fastify.prisma.client.findUnique({
        where: { id: data.clientId },
      });

      if (!client) {
        throw new Error("CLIENT_NOT_FOUND");
      }
    }

    return this.fastify.prisma.project.update({
      where: { id },
      data,
      include: {
        client: true,
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }

  async delete(id: string, userId: string, role: string) {
    const project = await this.fastify.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new Error("PROJECT_NOT_FOUND");
    }

    if (role !== "ADMIN" && project.createdById !== userId) {
      throw new Error("FORBIDDEN");
    }

    await this.fastify.prisma.project.delete({ where: { id } });

    return { message: "Project deleted successfully" };
  }
}