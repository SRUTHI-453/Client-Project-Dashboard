"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing");
    }
    if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error("JWT_REFRESH_SECRET is missing");
    }
    await fastify.register(jwt_1.default, {
        secret: process.env.JWT_SECRET,
    });
    await fastify.register(jwt_1.default, {
        secret: process.env.JWT_REFRESH_SECRET,
        namespace: "refreshJwt",
    });
});
