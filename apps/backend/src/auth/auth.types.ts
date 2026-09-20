import { UserRole } from "../../generated/prisma/client";

export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
}