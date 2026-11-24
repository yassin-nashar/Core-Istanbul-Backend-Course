import { Router } from "express";

import { createTicketController } from "../controllers/ticket.controller.js";
import type { TicketService } from "../services/ticket.service.js";

export function createTicketRouter(service: TicketService): Router {
  const router = Router();
  const controller = createTicketController(service);

  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.post("/", controller.create);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.remove);

  return router;
}
