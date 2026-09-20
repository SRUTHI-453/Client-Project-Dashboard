import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ActivityService } from "./activity.service";

export class ActivityController {
  private readonly service: ActivityService;

  constructor(private readonly fastify: FastifyInstance) {
    this.service = new ActivityService(fastify);
  }

  async findByProject(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const user = request.user as {
      userId: string;
      email: string;
      role: any;
    };

    const { projectId } = request.params as {
      projectId: string;
    };

    const activities = await this.service.findByProject(
      projectId,
      user.userId,
      user.role
    );

    return reply.send({
      success: true,
      data: activities,
    });
  }
}
