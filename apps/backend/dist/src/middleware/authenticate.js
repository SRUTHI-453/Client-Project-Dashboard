"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function authenticate(request, reply) {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("MISSING_TOKEN");
        }
        const token = authHeader.slice(7);
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        request.user = payload;
    }
    catch (err) {
        console.error("AUTH ERROR:", err); // TEMP DEBUG — remove after fixing
        return reply.status(401).send({
            success: false,
            error: {
                code: "UNAUTHORIZED",
                message: "Invalid or expired access token",
            },
        });
    }
}
