import type { RequestHandler } from "express";

import {
  createTicketSchema,
  ticketIdSchema,
  updateTicketSchema,
  ticketFilterSchema,
} from "../schemas/ticket.schema.js";
import type { TicketService } from "../services/ticket.service.js";

export function createTicketController(service: TicketService) {
  const list: RequestHandler = async (request, response) => {
    const filters = ticketFilterSchema.parse(request.query);
    response.status(200).json(await service.listTickets(request.user!, filters));
  };

  const getById: RequestHandler = async (request, response) => {
    const { id } = ticketIdSchema.parse(request.params);
    response.status(200).json(await service.getTicketById(id, request.user!));
  };

  const create: RequestHandler = async (request, response) => {
    const input = createTicketSchema.parse(request.body);
    response.status(201).json(await service.createTicket(input, request.user!));
  };

  const update: RequestHandler = async (request, response) => {
    const { id } = ticketIdSchema.parse(request.params);
    const input = updateTicketSchema.parse(request.body);
    response.status(200).json(await service.updateTicket(id, input, request.user!));
  };

  const remove: RequestHandler = async (request, response) => {
    const { id } = ticketIdSchema.parse(request.params);
    await service.deleteTicket(id);
    response.status(204).send();
  };

  return { list, getById, create, update, remove };
}
