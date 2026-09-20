"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const auth_service_1 = require("./auth.service");
const auth_schema_1 = require("./auth.schema");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
// import { authorize } from "../middleware/authorize";
async function authRoutes(fastify) {
    const authService = new auth_service_1.AuthService(fastify);
    // =========================================================
    // LOGIN
    // POST /api/auth/login
    // =========================================================
    fastify.post("/login", {
        schema: auth_schema_1.loginSchema,
    }, async (request, reply) => {
        try {
            const { email, password } = request.body;
            const result = await authService.login(email, password);
            return reply
                .setCookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/api/auth",
                maxAge: 7 * 24 * 60 * 60,
            })
                .send({
                success: true,
                data: {
                    accessToken: result.accessToken,
                    user: result.user,
                },
            });
        }
        catch (error) {
            if (error instanceof Error &&
                error.message === "INVALID_CREDENTIALS") {
                return reply.status(401).send({
                    success: false,
                    error: {
                        code: "INVALID_CREDENTIALS",
                        message: "Invalid email or password",
                    },
                });
            }
            throw error;
        }
    });
    // =========================================================
    // REFRESH
    // POST /api/auth/refresh
    // =========================================================
    fastify.post("/refresh", async (request, reply) => {
        try {
            const refreshToken = request.cookies.refreshToken;
            if (!refreshToken) {
                return reply.status(401).send({
                    success: false,
                    error: {
                        code: "MISSING_REFRESH_TOKEN",
                        message: "Refresh token is missing",
                    },
                });
            }
            const result = await authService.refresh(refreshToken);
            return reply.send({
                success: true,
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error &&
                error.message === "INVALID_REFRESH_TOKEN") {
                return reply.status(401).send({
                    success: false,
                    error: {
                        code: "INVALID_REFRESH_TOKEN",
                        message: "Invalid or expired refresh token",
                    },
                });
            }
            throw error;
        }
    });
    // =========================================================
    // LOGOUT
    // POST /api/auth/logout
    // =========================================================
    fastify.post("/logout", async (request, reply) => {
        const refreshToken = request.cookies.refreshToken;
        if (refreshToken) {
            await authService.logout(refreshToken);
        }
        reply.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/api/auth",
        });
        return reply.send({
            success: true,
            data: {
                message: "Logged out successfully",
            },
        });
    });
    //  authentication mid
    fastify.get("/me", {
        preHandler: authenticate_1.authenticate,
    }, async (request, reply) => {
        try {
            const user = request.user;
            const result = await authService.getMe(user.userId);
            return reply.send({
                success: true,
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error &&
                error.message === "USER_NOT_FOUND") {
                return reply.status(404).send({
                    success: false,
                    error: {
                        code: "USER_NOT_FOUND",
                        message: "User not found",
                    },
                });
            }
            throw error;
        }
    });
    // authorize
    fastify.get("/admin-test", {
        preHandler: [
            authenticate_1.authenticate,
            (0, authorize_1.authorize)("ADMIN"),
        ],
    }, async (_request, reply) => {
        return reply.send({
            success: true,
            message: "Admin access granted",
        });
    });
}
