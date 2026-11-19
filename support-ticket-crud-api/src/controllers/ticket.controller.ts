import type { RequestHandler } from "express";

import { AppError } from "../errors/app-error.js";
import {
  createTicketSchema,
  updateTicketSchema,
} from "../schemas/ticket.schema.js";
import { ticketService } from "../services/ticket.service.js";

export const listTickets: RequestHandler = (_request, response) => {
  response.status(200).json(ticketService.list());
};

export const getTicket: RequestHandler<{ id: string }> = (request, response) => {
  const ticket = ticketService.getById(request.params.id);

  if (!ticket) {
    throw new AppError(404, "Ticket not found");
  }

  response.status(200).json(ticket);
};

export const createTicket: RequestHandler = (request, response) => {
  const input = createTicketSchema.parse(request.body);
  const ticket = ticketService.create(input);

  response.status(201).json(ticket);
};

export const updateTicket: RequestHandler<{ id: string }> = (
  request,
  response,
) => {
  const input = updateTicketSchema.parse(request.body);
  const ticket = ticketService.update(request.params.id, input);

  if (!ticket) {
    throw new AppError(404, "Ticket not found");
  }

  response.status(200).json(ticket);
};

export const deleteTicket: RequestHandler<{ id: string }> = (
  request,
  response,
) => {
  const wasDeleted = ticketService.delete(request.params.id);

  if (!wasDeleted) {
    throw new AppError(404, "Ticket not found");
  }

  response.status(204).send();
};
