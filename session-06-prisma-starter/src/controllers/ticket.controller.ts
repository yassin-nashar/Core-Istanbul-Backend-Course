import type { RequestHandler } from "express";

import {
  createTicketSchema,
  ticketIdSchema,
  updateTicketSchema,
} from "../schemas/ticket.schema.js";
import type { TicketService } from "../services/ticket.service.js";

export function createTicketController(service: TicketService) {
  const list: RequestHandler = (_request, response) => {
    response.status(200).json(service.listTickets());
  };

  const getById: RequestHandler = (request, response) => {
    const { id } = ticketIdSchema.parse(request.params);
    response.status(200).json(service.getTicketById(id));
  };

  const create: RequestHandler = (request, response) => {
    const input = createTicketSchema.parse(request.body);
    response.status(201).json(service.createTicket(input));
  };

  const update: RequestHandler = (request, response) => {
    const { id } = ticketIdSchema.parse(request.params);
    const input = updateTicketSchema.parse(request.body);
    response.status(200).json(service.updateTicket(id, input));
  };

  const remove: RequestHandler = (request, response) => {
    const { id } = ticketIdSchema.parse(request.params);
    service.deleteTicket(id);
    response.status(204).send();
  };

  return { list, getById, create, update, remove };
}
