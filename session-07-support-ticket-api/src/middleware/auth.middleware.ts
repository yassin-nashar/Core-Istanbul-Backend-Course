import type { RequestHandler } from "express";
import { verifyAccessToken } from "../lib/access-token.js";

export const authenticate: RequestHandler = (request, response, next) => {
  const authorization = request.get("authorization");
  const match = authorization?.match(/^Bearer ([^\s]+)$/);
  if (!match) {
    response.set("WWW-Authenticate", "Bearer").status(401).json({ error: { message: "Authentication required" } });
    return;
  }
  try {
    const payload = verifyAccessToken(match[1]!);
    request.user = { id: payload.sub };
    next();
  } catch {
    response.set("WWW-Authenticate", 'Bearer error="invalid_token"').status(401).json({ error: { message: "Invalid or expired access token" } });
  }
};
