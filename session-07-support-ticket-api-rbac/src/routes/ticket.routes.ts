import { Router } from "express";

import { createTicketController } from "../controllers/ticket.controller.js";
import type { TicketService } from "../services/ticket.service.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";

export function createTicketRouter(service: TicketService): Router {
  const router = Router();
  const controller = createTicketController(service);

  router.get("/", authenticate, authorizeRoles("USER", "ADMIN"), controller.list);
  router.get("/:id", authenticate, authorizeRoles("USER", "ADMIN"), controller.getById);
  router.post("/", authenticate, authorizeRoles("USER", "ADMIN"), controller.create);
  router.patch("/:id", authenticate, authorizeRoles("USER", "ADMIN"), controller.update);
  router.delete("/:id", authenticate, authorizeRoles("ADMIN"), controller.remove);

  return router;
}
