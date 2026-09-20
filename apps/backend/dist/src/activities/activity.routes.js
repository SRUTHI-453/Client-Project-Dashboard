"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityRoutes = activityRoutes;
const authenticate_1 = require("../middleware/authenticate");
const activity_controller_1 = require("./activity.controller");
async function activityRoutes(fastify) {
    const controller = new activity_controller_1.ActivityController(fastify);
    fastify.get("/projects/:projectId/activities", {
        preHandler: [authenticate_1.authenticate],
        schema: {
            params: {
                type: "object",
                required: ["projectId"],
                additionalProperties: false,
                properties: {
                    projectId: {
                        type: "string",
                        format: "uuid",
                    },
                },
            },
        },
    }, controller.findByProject.bind(controller));
}
