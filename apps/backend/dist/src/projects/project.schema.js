"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchProjectSchema = exports.updateProjectSchema = exports.projectIdSchema = exports.createProjectSchema = void 0;
exports.createProjectSchema = {
    body: {
        type: "object",
        required: ["name", "clientId"],
        properties: {
            name: { type: "string", minLength: 1 },
            description: { type: "string" },
            clientId: { type: "string" },
        },
    },
};
exports.projectIdSchema = {
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "string" },
        },
    },
};
exports.updateProjectSchema = {
    body: {
        type: "object",
        required: ["name", "description", "clientId"],
        properties: {
            name: { type: "string", minLength: 1 },
            description: { type: "string" },
            clientId: { type: "string" },
        },
    },
};
exports.patchProjectSchema = {
    body: {
        type: "object",
        properties: {
            name: { type: "string", minLength: 1 },
            description: { type: "string" },
            clientId: { type: "string" },
        },
    },
};
