import type { RequestHandler } from "express";
import type { UserRole } from "../generated/prisma/client.js";

export function authorizeRoles(...allowedRoles: UserRole[]): RequestHandler {
  return (request, response, next) => {
    if (!request.user) {
      response.set("WWW-Authenticate", "Bearer").status(401).json({ error: { message: "Authentication required" } });
      return;
    }
    if (!allowedRoles.includes(request.user.role)) {
      response.status(403).json({ error: { message: "Forbidden" } });
      return;
    }
    next();
  };
}
