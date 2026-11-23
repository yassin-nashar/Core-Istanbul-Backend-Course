import { randomUUID } from "node:crypto";

import { AppError } from "../middleware/error.middleware.js";
import type { CreateTicketInput, Ticket, UpdateTicketInput } from "../types/ticket.js";

export interface TicketService {
  listTickets(): Ticket[];
  getTicketById(id: string): Ticket;
  createTicket(input: CreateTicketInput): Ticket;
  updateTicket(id: string, input: UpdateTicketInput): Ticket;
  deleteTicket(id: string): void;
}

export function createTicketService(): TicketService {
  const tickets = new Map<string, Ticket>();

  function getTicketById(id: string): Ticket {
    const ticket = tickets.get(id);
    if (!ticket) {
      throw new AppError(404, "Ticket not found");
    }
    return ticket;
  }

  return {
    listTickets: () => [...tickets.values()],
    getTicketById,
    createTicket: (input) => {
      const ticket: Ticket = {
        id: randomUUID(),
        ...input,
        createdAt: new Date().toISOString(),
      };
      tickets.set(ticket.id, ticket);
      return ticket;
    },
    updateTicket: (id, input) => {
      const updated = { ...getTicketById(id), ...input };
      tickets.set(id, updated);
      return updated;
    },
    deleteTicket: (id) => {
      getTicketById(id);
      tickets.delete(id);
    },
  };
}
