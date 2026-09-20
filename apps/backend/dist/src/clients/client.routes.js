"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientRoutes = clientRoutes;
const client_service_1 = require("./client.service");
const client_controller_1 = require("./client.controller");
const client_schema_1 = require("./client.schema");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
async function clientRoutes(fastify) {
    const clientService = new client_service_1.ClientService(fastify);
    const clientController = new client_controller_1.ClientController(clientService);
    // CREATE
    fastify.post("/clients", {
        schema: client_schema_1.createClientSchema,
        preHandler: [
            authenticate_1.authenticate,
            (0, authorize_1.authorize)("ADMIN", "PROJECT_MANAGER"),
        ],
    }, clientController.create.bind(clientController));
    // GET ALL
    fastify.get("/clients", {
        preHandler: [
            authenticate_1.authenticate,
            (0, authorize_1.authorize)("ADMIN", "PROJECT_MANAGER"),
        ],
    }, clientController.findAll.bind(clientController));
    // GET BY ID
    fastify.get("/clients/:id", {
        schema: client_schema_1.clientIdSchema,
        preHandler: [
            authenticate_1.authenticate,
            (0, authorize_1.authorize)("ADMIN", "PROJECT_MANAGER"),
        ],
    }, clientController.findById.bind(clientController));
    // PUT
    fastify.put("/clients/:id", {
        schema: {
            ...client_schema_1.clientIdSchema,
            body: client_schema_1.updateClientSchema,
        },
        preHandler: [
            authenticate_1.authenticate,
            (0, authorize_1.authorize)("ADMIN", "PROJECT_MANAGER"),
        ],
    }, clientController.update.bind(clientController));
    // PATCH
    fastify.patch("/clients/:id", {
        schema: {
            ...client_schema_1.clientIdSchema,
            body: client_schema_1.patchClientSchema,
        },
        preHandler: [
            authenticate_1.authenticate,
            (0, authorize_1.authorize)("ADMIN", "PROJECT_MANAGER"),
        ],
    }, clientController.patch.bind(clientController));
    // DELETE
    fastify.delete("/clients/:id", {
        schema: client_schema_1.clientIdSchema,
        preHandler: [
            authenticate_1.authenticate,
            (0, authorize_1.authorize)("ADMIN", "PROJECT_MANAGER"),
        ],
    }, clientController.delete.bind(clientController));
}
