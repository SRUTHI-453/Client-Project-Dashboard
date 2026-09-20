"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchTaskSchema = exports.updateTaskSchema = exports.taskIdSchema = exports.createTaskSchema = void 0;
exports.createTaskSchema = {
    body: {
        type: "object",
        required: ["projectId", "title"],
        properties: {
            projectId: { type: "string" },
            title: { type: "string", minLength: 1 },
            description: { type: "string" },
            assignedDeveloperId: { type: "string" },
            status: { type: "string" },
            priority: { type: "string" },
            dueDate: { type: "string" },
        },
    },
};
exports.taskIdSchema = {
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "string" },
        },
    },
};
exports.updateTaskSchema = {
    body: {
        type: "object",
        required: ["title"],
        properties: {
            title: { type: "string", minLength: 1 },
            description: { type: "string" },
            assignedDeveloperId: { type: "string" },
            status: { type: "string" },
            priority: { type: "string" },
            dueDate: { type: "string" },
        },
    },
};
exports.patchTaskSchema = {
    body: {
        type: "object",
        properties: {
            title: { type: "string", minLength: 1 },
            description: { type: "string" },
            assignedDeveloperId: { type: "string" },
            status: { type: "string" },
            priority: { type: "string" },
            dueDate: { type: "string" },
        },
    },
};
