import bcrypt from "bcrypt";
import crypto from "crypto";
import type { FastifyInstance } from "fastify";

import type {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "./auth.types";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor(private readonly fastify: FastifyInstance) {}

  // =========================================================
  // LOGIN
  // =========================================================

  async login(email: string, password: string) {
    const user = await this.fastify.prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // -------------------------
    // Create Access Token
    // -------------------------

    const accessPayload: AccessTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.fastify.jwt.sign(accessPayload, {
      expiresIn: "15m",
    });

    // -------------------------
    // Create Refresh Token
    // -------------------------

    const tokenId = crypto.randomUUID();

    const refreshPayload: RefreshTokenPayload = {
      userId: user.id,
      tokenId,
    };

    const refreshToken = jwt.sign(
  refreshPayload,
  process.env.JWT_REFRESH_SECRET!,
  { expiresIn: "7d" }
);

    // Never store the actual refresh token in DB.
    // Store only its bcrypt hash.
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    await this.fastify.prisma.refreshToken.create({
      data: {
        id: tokenId,
        tokenHash,
        userId: user.id,
        expiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // =========================================================
  // REFRESH ACCESS TOKEN
  // =========================================================

  async refresh(refreshToken: string) {
    let payload: RefreshTokenPayload;

    // -------------------------
    // Verify Refresh JWT
    // -------------------------

    try {
      payload = jwt.verify(
  refreshToken,
  process.env.JWT_REFRESH_SECRET!
) as RefreshTokenPayload;
    } catch {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    // -------------------------
    // Find Token in DB
    // -------------------------

    const storedToken =
      await this.fastify.prisma.refreshToken.findUnique({
        where: {
          id: payload.tokenId,
        },
      });

    if (!storedToken) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    // -------------------------
    // Check Revoked
    // -------------------------

    if (storedToken.revokedAt) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    // -------------------------
    // Check Expiration
    // -------------------------

    if (storedToken.expiresAt < new Date()) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    // -------------------------
    // Compare Token Hash
    // -------------------------

    const tokenMatches = await bcrypt.compare(
      refreshToken,
      storedToken.tokenHash
    );

    if (!tokenMatches) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    // -------------------------
    // Find User
    // -------------------------

    const user = await this.fastify.prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    // -------------------------
    // Create New Access Token
    // -------------------------

    const accessPayload: AccessTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.fastify.jwt.sign(accessPayload, {
      expiresIn: "15m",
    });

    return {
      accessToken,
    };
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  async logout(refreshToken: string) {
    let payload: RefreshTokenPayload;

    // -------------------------
    // Verify Refresh Token
    // -------------------------

    try {
     payload = jwt.verify(
  refreshToken,
  process.env.JWT_REFRESH_SECRET!
) as RefreshTokenPayload;
    } catch {
      // Token is already invalid/expired.
      // There is nothing else to revoke.
      return;
    }

    // -------------------------
    // Revoke Token
    // -------------------------

    await this.fastify.prisma.refreshToken.updateMany({
      where: {
        id: payload.tokenId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  // =========================================================
  // GET CURRENT USER
  // =========================================================

  async getMe(userId: string) {
    const user = await this.fastify.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return user;
  }
}