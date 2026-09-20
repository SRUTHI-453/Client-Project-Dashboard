import type { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { TaskController } from "./task.controller";

import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
  patchTaskSchema,
} from "./task.schema";

export async function taskRoutes(fastify: FastifyInstance) {
  const controller = new TaskController(fastify);

  // Create task
  fastify.post(
    "/tasks",
    {
      schema: createTaskSchema,
      preHandler: [
        authenticate,
        authorize("ADMIN", "PROJECT_MANAGER"),
      ],
    },
    controller.create.bind(controller)
  );

  // Get tasks
  fastify.get(
    "/tasks",
    {
      preHandler: [authenticate],
    },
    controller.findAll.bind(controller)
  );

  // Get task by ID
  fastify.get(
    "/tasks/:id",
    {
      schema: taskIdSchema,
      preHandler: [authenticate],
    },
    controller.findById.bind(controller)
  );

  // Full update
  fastify.put(
    "/tasks/:id",
    {
      schema: {
        ...taskIdSchema,
        ...updateTaskSchema,
      },
      preHandler: [
        authenticate,
        authorize("ADMIN", "PROJECT_MANAGER"),
      ],
    },
    controller.update.bind(controller)
  );

  // Partial update
  fastify.patch(
    "/tasks/:id",
    {
      schema: {
        ...taskIdSchema,
        ...patchTaskSchema,
      },
      preHandler: [
        authenticate,
        authorize("ADMIN", "PROJECT_MANAGER"),
      ],
    },
    controller.patch.bind(controller)
  );

  // Delete
  fastify.delete(
    "/tasks/:id",
    {
      schema: taskIdSchema,
      preHandler: [
        authenticate,
        authorize("ADMIN", "PROJECT_MANAGER"),
      ],
    },
    controller.delete.bind(controller)
  );
}