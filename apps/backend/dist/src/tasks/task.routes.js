"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRoutes = taskRoutes;
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const task_controller_1 = require("./task.controller");
const task_schema_1 = require("./task.schema");
async function taskRoutes(fastify) {
    const controller = new task_controller_1.TaskController(fastify);
    // Create task
    fastify.post("/tasks", {
        schema: task_schema_1.createTaskSchema,
        preHandler: [
            authenticate_1.authenticate,
            (0, authorize_1.authorize)("ADMIN", "PROJECT_MANAGER"),
        ],
    }, controller.create.bind(controller));
    // Get tasks
    fastify.get("/tasks", {
        preHandler: [authenticate_1.authenticate],
    }, controller.findAll.bind(controller));
    // Get task by ID
    fastify.get("/tasks/:id", {
        schema: task_schema_1.taskIdSchema,
        preHandler: [authenticate_1.authenticate],
    }, controller.findById.bind(controller));
    // Full update
    fastify.put("/tasks/:id", {
        schema: {
            ...task_schema_1.taskIdSchema,
            ...task_schema_1.updateTaskSchema,
        },
        preHandler: [
            authenticate_1.authenticate,
            (0, authorize_1.authorize)("ADMIN", "PROJECT_MANAGER"),
        ],
    }, controller.update.bind(controller));
    // Partial update
    fastify.patch("/tasks/:id", {
        schema: {
            ...task_schema_1.taskIdSchema,
            ...task_schema_1.patchTaskSchema,
        },
        preHandler: [
            authenticate_1.authenticate,
            (0, authorize_1.authorize)("ADMIN", "PROJECT_MANAGER"),
        ],
    }, controller.patch.bind(controller));
    // Delete
    fastify.delete("/tasks/:id", {
        schema: task_schema_1.taskIdSchema,
        preHandler: [
            authenticate_1.authenticate,
            (0, authorize_1.authorize)("ADMIN", "PROJECT_MANAGER"),
        ],
    }, controller.delete.bind(controller));
}
