"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoutes = projectRoutes;
const project_service_1 = require("./project.service");
const project_controller_1 = require("./project.controller");
const project_schema_1 = require("./project.schema");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
async function projectRoutes(fastify) {
    const projectService = new project_service_1.ProjectService(fastify);
    const projectController = new project_controller_1.ProjectController(projectService);
    // CREATE
    fastify.post("/projects", {
        schema: project_schema_1.createProjectSchema,
        preHandler: [
            authenticate_1.authenticate,
            (0, authorize_1.authorize)("ADMIN", "PROJECT_MANAGER"),
        ],
    }, projectController.create.bind(projectController));
    // GET ALL
    fastify.get("/projects", {
        preHandler: [
            authenticate_1.authenticate,
            (0, authorize_1.authorize)("ADMIN", "PROJECT_MANAGER"),
        ],
    }, projectController.findAll.bind(projectController));
    // GET BY ID
    fastify.get("/projects/:id", {
        schema: project_schema_1.projectIdSchema,
        preHandler: [authenticate_1.authenticate],
    }, projectController.findById.bind(projectController));
    // PUT
    fastify.put("/projects/:id", {
        schema: {
            ...project_schema_1.projectIdSchema,
            body: project_schema_1.updateProjectSchema.body,
        },
        preHandler: [
            authenticate_1.authenticate,
            (0, authorize_1.authorize)("ADMIN", "PROJECT_MANAGER"),
        ],
    }, projectController.update.bind(projectController));
    // PATCH
    fastify.patch("/projects/:id", {
        schema: {
            ...project_schema_1.projectIdSchema,
            body: project_schema_1.patchProjectSchema.body,
        },
        preHandler: [
            authenticate_1.authenticate,
            (0, authorize_1.authorize)("ADMIN", "PROJECT_MANAGER"),
        ],
    }, projectController.patch.bind(projectController));
    // DELETE
    fastify.delete("/projects/:id", {
        schema: project_schema_1.projectIdSchema,
        preHandler: [
            authenticate_1.authenticate,
            (0, authorize_1.authorize)("ADMIN", "PROJECT_MANAGER"),
        ],
    }, projectController.delete.bind(projectController));
}
