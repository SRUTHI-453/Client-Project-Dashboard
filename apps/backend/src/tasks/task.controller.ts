import type { FastifyReply, FastifyRequest } from "fastify";
import { TaskService } from "./task.service";

export class TaskController {
  private readonly service: TaskService;

  constructor(private readonly fastify: any) {
    this.service = new TaskService(fastify);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as any;

    const task = await this.service.create(
      user.userId,
      user.role,
      request.body as any
    );

    return reply.status(201).send({
      success: true,
      data: task,
    });
  }

  async findAll(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as any;

    const tasks = await this.service.findAll(
      user.userId,
      user.role
    );

    return reply.send({
      success: true,
      data: tasks,
    });
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as any;
    const { id } = request.params as { id: string };

    const task = await this.service.findById(
      id,
      user.userId,
      user.role
    );

    return reply.send({
      success: true,
      data: task,
    });
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as any;
    const { id } = request.params as { id: string };

    const task = await this.service.update(
  id,
  user.userId,
  user.role,
  request.body,
  user.name
);

    return reply.send({
      success: true,
      data: task,
    });
  }

  async patch(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as any;
    const { id } = request.params as { id: string };

    const task = await this.service.patch(
      id,
      user.userId,
      user.role,
      request.body,
      user.name
    );

    return reply.send({
      success: true,
      data: task,
    });
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as any;
    const { id } = request.params as { id: string };

    const result = await this.service.delete(
      id,
      user.userId,
      user.role
    );

    return reply.send({
      success: true,
      data: result,
    });
  }
}