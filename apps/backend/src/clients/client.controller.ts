import type { FastifyReply, FastifyRequest } from "fastify";
import { ClientService } from "./client.service";

export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { name, email } = request.body as {
      name: string;
      email?: string;
    };

    const client = await this.clientService.create(name, email);

    return reply.status(201).send({
      success: true,
      data: client,
    });
  }

  async findAll(
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    const clients = await this.clientService.findAll();

    return reply.send({
      success: true,
      data: clients,
    });
  }

  async findById(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = request.params as {
      id: string;
    };

    try {
      const client = await this.clientService.findById(id);

      return reply.send({
        success: true,
        data: client,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "CLIENT_NOT_FOUND"
      ) {
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

  async update(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = request.params as {
      id: string;
    };

    const { name, email } = request.body as {
      name: string;
      email: string;
    };

    try {
      const client = await this.clientService.update(
        id,
        name,
        email
      );

      return reply.send({
        success: true,
        data: client,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "CLIENT_NOT_FOUND"
      ) {
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

  async patch(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = request.params as {
      id: string;
    };

    const data = request.body as {
      name?: string;
      email?: string;
    };

    try {
      const client = await this.clientService.patch(
        id,
        data
      );

      return reply.send({
        success: true,
        data: client,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "CLIENT_NOT_FOUND"
      ) {
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

  async delete(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = request.params as {
      id: string;
    };

    try {
      const result = await this.clientService.delete(id);

      return reply.send({
        success: true,
        data: result,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "CLIENT_NOT_FOUND"
      ) {
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