"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchClientSchema = exports.updateClientSchema = exports.clientIdSchema = exports.createClientSchema = void 0;
exports.createClientSchema = {
    body: {
        type: "object",
        required: ["name"],
        properties: {
            name: { type: "string", minLength: 1 },
            email: { type: "string" },
            phone: { type: "string" },
        },
    },
};
exports.clientIdSchema = {
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "string" },
        },
    },
};
exports.updateClientSchema = {
    type: "object",
    required: ["name"],
    properties: {
        name: { type: "string", minLength: 1 },
        email: { type: "string" },
        phone: { type: "string" },
    },
};
exports.patchClientSchema = {
    type: "object",
    properties: {
        name: { type: "string", minLength: 1 },
        email: { type: "string" },
        phone: { type: "string" },
    },
};
