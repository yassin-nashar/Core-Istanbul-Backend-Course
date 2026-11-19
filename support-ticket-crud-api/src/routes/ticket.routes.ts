import { Router } from "express";

import {
  createTicket,
  deleteTicket,
  getTicket,
  listTickets,
  updateTicket,
} from "../controllers/ticket.controller.js";

export const ticketRouter = Router();

ticketRouter.get("/", listTickets);
ticketRouter.get("/:id", getTicket);
ticketRouter.post("/", createTicket);
ticketRouter.patch("/:id", updateTicket);
ticketRouter.delete("/:id", deleteTicket);
