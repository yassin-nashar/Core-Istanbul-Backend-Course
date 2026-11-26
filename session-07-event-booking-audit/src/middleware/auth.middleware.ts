import type { RequestHandler } from "express";
import { verifyAccessToken } from "../lib/access-token.js";
import { prisma } from "../lib/prisma.js";

export const authenticate: RequestHandler = async (request, response, next) => {
  const authorization = request.get("authorization");
  const match = authorization?.match(/^Bearer ([^\s]+)$/);
  if (!match) {
    response.set("WWW-Authenticate", "Bearer").status(401).json({ error: { message: "Authentication required" } });
    return;
  }
  let userId: string;
  try {
    userId = verifyAccessToken(match[1]!).sub;
  } catch {
    response.set("WWW-Authenticate", 'Bearer error="invalid_token"').status(401).json({ error: { message: "Invalid or expired access token" } });
    return;
  }
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } });
  if (!user || (user.role !== "USER" && user.role !== "ADMIN")) {
    response.set("WWW-Authenticate", 'Bearer error="invalid_token"').status(401).json({ error: { message: "Invalid or expired access token" } });
    return;
  }
  request.user = user;
  next();
};
