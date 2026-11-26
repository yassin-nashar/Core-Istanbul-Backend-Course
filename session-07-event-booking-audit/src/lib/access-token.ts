import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAccessToken(userId: string): string {
  return jwt.sign({ tokenType: "access" }, env.JWT_SECRET, { algorithm: "HS256", issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE, subject: userId, expiresIn: env.ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"] });
}

export function verifyAccessToken(token: string): JwtPayload & { sub: string; tokenType: "access" } {
  const payload = jwt.decode(token);
  if (!payload || typeof payload === "string" || typeof payload.sub !== "string" || payload.sub.length === 0 || typeof payload.iat !== "number" || typeof payload.exp !== "number" || payload.tokenType !== "access") throw new Error("Invalid access token claims");
  return payload as JwtPayload & { sub: string; tokenType: "access" };
}
