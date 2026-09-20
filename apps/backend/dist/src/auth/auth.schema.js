"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
exports.loginSchema = {
    body: {
        type: "object",
        required: ["email", "password"],
        additionalProperties: false,
        properties: {
            email: {
                type: "string",
                format: "email",
            },
            password: {
                type: "string",
                minLength: 6,
            },
        },
    },
};
