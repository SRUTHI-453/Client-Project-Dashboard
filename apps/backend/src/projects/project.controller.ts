import type { FastifyReply, FastifyRequest } from "fastify";
import { ProjectService } from "./project.service";

export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { name, description, clientId } = request.body as {
      name: string;
      description?: string;
      clientId: string;
    };
    const user = request.user as { userId: string; role: string };

    try {
      const project = await this.projectService.create(
        name, description, clientId, user.userId
      );
      return reply.status(201).send({ success: true, data: project });
    } catch (error) {
      if (error instanceof Error && error.message === "CLIENT_NOT_FOUND") {
        return reply.status(404).send({
          success: false,
          error: { code: "CLIENT_NOT_FOUND", message: "Client not found" },
        });
      }
      throw error;
    }
  }

  async findAll(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { userId: string; role: string };
    const projects = await this.projectService.findAll(user.userId, user.role);
    return reply.send({ success: true, data: projects });
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const user = request.user as { userId: string; role: string };

    try {
      const project = await this.projectService.findById(id, user.userId, user.role);
      return reply.send({ success: true, data: project });
    } catch (error) {
      return this.handleError(error, reply);
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { name, description, clientId } = request.body as {
      name: string; description: string; clientId: string;
    };
    const user = request.user as { userId: string; role: string };

    try {
      const project = await this.projectService.update(
        id, user.userId, user.role, { name, description, clientId }
      );
      return reply.send({ success: true, data: project });
    } catch (error) {
      return this.handleError(error, reply);
    }
  }

  async patch(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = request.body as {
      name?: string; description?: string; clientId?: string;
    };
    const user = request.user as { userId: string; role: string };

    try {
      const project = await this.projectService.patch(id, user.userId, user.role, data);
      return reply.send({ success: true, data: project });
    } catch (error) {
      return this.handleError(error, reply);
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const user = request.user as { userId: string; role: string };

    try {
      const result = await this.projectService.delete(id, user.userId, user.role);
      return reply.send({ success: true, data: result });
    } catch (error) {
      return this.handleError(error, reply);
    }
  }

  private handleError(error: unknown, reply: FastifyReply) {
    if (!(error instanceof Error)) throw error;

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