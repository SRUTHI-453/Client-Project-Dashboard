import type { FastifyInstance } from "fastify";

import { ClientService } from "./client.service";
import { ClientController } from "./client.controller";

import {
  createClientSchema,
  clientIdSchema,
  updateClientSchema,
  patchClientSchema,
} from "./client.schema";

import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

export async function clientRoutes(
  fastify: FastifyInstance
) {
  const clientService = new ClientService(fastify);
  const clientController = new ClientController(clientService);

  // CREATE
  fastify.post(
    "/clients",
    {
      schema: createClientSchema,
      preHandler: [
        authenticate,
        authorize("ADMIN", "PROJECT_MANAGER"),
      ],
    },
    clientController.create.bind(clientController)
  );

  // GET ALL
  fastify.get(
    "/clients",
    {
      preHandler: [
        authenticate,
        authorize("ADMIN", "PROJECT_MANAGER"),
      ],
    },
    clientController.findAll.bind(clientController)
  );

  // GET BY ID
  fastify.get(
    "/clients/:id",
    {
      schema: clientIdSchema,
      preHandler: [
        authenticate,
        authorize("ADMIN", "PROJECT_MANAGER"),
      ],
    },
    clientController.findById.bind(clientController)
  );

  // PUT
  fastify.put(
    "/clients/:id",
    {
      schema: {
        ...clientIdSchema,
        body: updateClientSchema,
      },
      preHandler: [
        authenticate,
        authorize("ADMIN", "PROJECT_MANAGER"),
      ],
    },
    clientController.update.bind(clientController)
  );

  // PATCH
  fastify.patch(
    "/clients/:id",
    {
      schema: {
        ...clientIdSchema,
        body: patchClientSchema,
      },
      preHandler: [
        authenticate,
        authorize("ADMIN", "PROJECT_MANAGER"),
      ],
    },
    clientController.patch.bind(clientController)
  );

  // DELETE
  fastify.delete(
    "/clients/:id",
    {
      schema: clientIdSchema,
      preHandler: [
        authenticate,
        authorize("ADMIN", "PROJECT_MANAGER"),
      ],
    },
    clientController.delete.bind(clientController)
  );
}