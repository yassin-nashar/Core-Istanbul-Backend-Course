import { randomUUID } from "node:crypto";

import type {
  CreateTicketInput,
  UpdateTicketInput,
} from "../schemas/ticket.schema.js";
import type { Ticket } from "../types/ticket.js";

class TicketService {
  private readonly tickets = new Map<string, Ticket>();

  list(): Ticket[] {
    return Array.from(this.tickets.values());
  }

  getById(id: string): Ticket | undefined {
    return this.tickets.get(id);
  }

  create(input: CreateTicketInput): Ticket {
    const ticket: Ticket = {
      id: randomUUID(),
      ...input,
      createdAt: new Date().toISOString(),
    };

    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  update(id: string, input: UpdateTicketInput): Ticket | undefined {
    const existingTicket = this.tickets.get(id);

    if (!existingTicket) {
      return undefined;
    }

    const updatedTicket: Ticket = {
      ...existingTicket,
      ...input,
    };

    this.tickets.set(id, updatedTicket);
    return updatedTicket;
  }

  delete(id: string): boolean {
    return this.tickets.delete(id);
  }
}

export const ticketService = new TicketService();
