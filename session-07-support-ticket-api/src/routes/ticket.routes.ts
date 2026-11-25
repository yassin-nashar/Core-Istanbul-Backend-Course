import { Router } from "express";

import { createTicketController } from "../controllers/ticket.controller.js";
import type { TicketService } from "../services/ticket.service.js";
import { authenticate } from "../middleware/auth.middleware.js";

export function createTicketRouter(service: TicketService): Router {
  const router = Router();
  const controller = createTicketController(service);

  router.get("/", authenticate, controller.list);
  router.get("/:id", authenticate, controller.getById);
  router.post("/", authenticate, controller.create);
  router.patch("/:id", authenticate, controller.update);
  router.delete("/:id", authenticate, controller.remove);

  return router;
}
