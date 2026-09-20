import { Server as SocketIOServer } from "socket.io";
import type { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import type { FastifyInstance } from "fastify";

import {
  globalFeedRoom,
  pmFeedRoom,
  projectRoom,
  devFeedRoom,
} from "./rooms";

interface SocketAuthPayload {
  userId: string;
  email: string;
  role: string;
}

let io: SocketIOServer;

export function initSocket(httpServer: HTTPServer, fastify: FastifyInstance) {
  io = new SocketIOServer(httpServer, {
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

      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as SocketAuthPayload;

      socket.data.user = payload;
      next();
    } catch (err) {
      next(new Error("UNAUTHORIZED"));
    }
  });

  // --- Connection handler ---
  io.on("connection", async (socket) => {
    const user = socket.data.user as SocketAuthPayload;

    fastify.log.info(`Socket connected: ${user.email} (${user.role})`);

    // Role-based room joining
    if (user.role === "ADMIN") {
      socket.join(globalFeedRoom());
    }

    if (user.role === "PROJECT_MANAGER") {
      socket.join(pmFeedRoom(user.userId));

      // Join a room for each project this PM owns
      const ownedProjects = await fastify.prisma.project.findMany({
        where: { createdById: user.userId },
        select: { id: true },
      });

      for (const project of ownedProjects) {
        socket.join(projectRoom(project.id));
      }
    }

    if (user.role === "DEVELOPER") {
      socket.join(devFeedRoom(user.userId));

      // Also join rooms for projects containing tasks assigned to them,
      // so they see live updates while viewing that project
      const assignedTasks = await fastify.prisma.task.findMany({
        where: { assignedDeveloperId: user.userId },
        select: { projectId: true },
        distinct: ["projectId"],
      });

      for (const task of assignedTasks) {
        socket.join(projectRoom(task.projectId));
      }
    }

    // --- Presence tracking (for admin "online users" count) ---
    const onlineCount = io.sockets.sockets.size;
    io.to(globalFeedRoom()).emit("presence:update", { onlineCount });

    socket.on("disconnect", () => {
      fastify.log.info(`Socket disconnected: ${user.email}`);
      const updatedCount = io.sockets.sockets.size;
      io.to(globalFeedRoom()).emit("presence:update", {
        onlineCount: updatedCount,
      });
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized yet");
  }
  return io;
}