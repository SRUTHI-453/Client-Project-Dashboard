import type { FastifyInstance } from "fastify";

import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";

import {
  createProjectSchema,
  projectIdSchema,
  updateProjectSchema,
  patchProjectSchema,
} from "./project.schema";

import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
export async function projectRoutes(
  fastify: FastifyInstance
) {
  const projectService =
    new ProjectService(fastify);

  const projectController =
    new ProjectController(projectService);

  // CREATE
  fastify.post(
    "/projects",
    {
      schema: createProjectSchema,
      preHandler: [
        authenticate,
        authorize(
          "ADMIN",
          "PROJECT_MANAGER"
        ),
      ],
    },
    projectController.create.bind(
      projectController
    )
  );

  // GET ALL
  fastify.get(
    "/projects",
    {
      preHandler: [
        authenticate,
        authorize(
          "ADMIN",
          "PROJECT_MANAGER"
        ),
      ],
    },
    projectController.findAll.bind(
      projectController
    )
  );

  // GET BY ID
  fastify.get(
    "/projects/:id",
    {
      schema: projectIdSchema,
      preHandler: [authenticate],
    },
    projectController.findById.bind(
      projectController
    )
  );

  // PUT
  fastify.put(
    "/projects/:id",
    {
      schema: {
        ...projectIdSchema,
        body: updateProjectSchema.body,
      },
      preHandler: [
        authenticate,
        authorize(
          "ADMIN",
          "PROJECT_MANAGER"
        ),
      ],
    },
    projectController.update.bind(
      projectController
    )
  );

  // PATCH
  fastify.patch(
    "/projects/:id",
    {
      schema: {
        ...projectIdSchema,
        body: patchProjectSchema.body,
      },
      preHandler: [
        authenticate,
        authorize(
          "ADMIN",
          "PROJECT_MANAGER"
        ),
      ],
    },
    projectController.patch.bind(
      projectController
    )
  );

  // DELETE
  fastify.delete(
    "/projects/:id",
    {
      schema: projectIdSchema,
      preHandler: [
        authenticate,
        authorize(
          "ADMIN",
          "PROJECT_MANAGER"
        ),
      ],
    },
    projectController.delete.bind(
      projectController
    )
  );
}