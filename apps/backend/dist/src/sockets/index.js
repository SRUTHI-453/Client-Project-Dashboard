"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
exports.getIO = getIO;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const rooms_1 = require("./rooms");
let io;
function initSocket(httpServer, fastify) {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_ORIGIN || "*",
            credentials: true,
        },
    });
    // --- Auth middleware for every socket connection ---
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error("MISSING_TOKEN"));
            }
            const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.data.user = payload;
            next();
        }
        catch (err) {
            next(new Error("UNAUTHORIZED"));
        }
    });
    // --- Connection handler ---
    io.on("connection", async (socket) => {
        const user = socket.data.user;
        fastify.log.info(`Socket connected: ${user.email} (${user.role})`);
        // Role-based room joining
        if (user.role === "ADMIN") {
            socket.join((0, rooms_1.globalFeedRoom)());
        }
        if (user.role === "PROJECT_MANAGER") {
            socket.join((0, rooms_1.pmFeedRoom)(user.userId));
            // Join a room for each project this PM owns
            const ownedProjects = await fastify.prisma.project.findMany({
                where: { createdById: user.userId },
                select: { id: true },
            });
            for (const project of ownedProjects) {
                socket.join((0, rooms_1.projectRoom)(project.id));
            }
        }
        if (user.role === "DEVELOPER") {
            socket.join((0, rooms_1.devFeedRoom)(user.userId));
            // Also join rooms for projects containing tasks assigned to them,
            // so they see live updates while viewing that project
            const assignedTasks = await fastify.prisma.task.findMany({
                where: { assignedDeveloperId: user.userId },
                select: { projectId: true },
                distinct: ["projectId"],
            });
            for (const task of assignedTasks) {
                socket.join((0, rooms_1.projectRoom)(task.projectId));
            }
        }
        // --- Presence tracking (for admin "online users" count) ---
        const onlineCount = io.sockets.sockets.size;
        io.to((0, rooms_1.globalFeedRoom)()).emit("presence:update", { onlineCount });
        socket.on("disconnect", () => {
            fastify.log.info(`Socket disconnected: ${user.email}`);
            const updatedCount = io.sockets.sockets.size;
            io.to((0, rooms_1.globalFeedRoom)()).emit("presence:update", {
                onlineCount: updatedCount,
            });
        });
    });
    return io;
}
function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized yet");
    }
    return io;
}
