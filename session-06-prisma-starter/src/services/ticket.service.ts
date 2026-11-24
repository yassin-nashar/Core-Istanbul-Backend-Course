import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/error.middleware.js";
import type { CreateTicketInput, TicketFilters, UpdateTicketInput } from "../types/ticket.js";

type TicketRecord = Prisma.TicketGetPayload<object>;

export interface TicketService {
  listTickets(filters?: TicketFilters): Promise<TicketRecord[]>;
  getTicketById(id: string): Promise<TicketRecord>;
  createTicket(input: CreateTicketInput): Promise<TicketRecord>;
  updateTicket(id: string, input: UpdateTicketInput): Promise<TicketRecord>;
  deleteTicket(id: string): Promise<void>;
}

function translatePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    throw new AppError(404, "Ticket not found");
  }
  throw error;
}

export function createTicketService(): TicketService {
  return {
    listTickets: (filters = {}) => prisma.ticket.findMany({ where: filters }),
    getTicketById: async (id) => {
      const ticket = await prisma.ticket.findUnique({ where: { id } });
      if (!ticket) throw new AppError(404, "Ticket not found");
      return ticket;
    },
    createTicket: (input) => prisma.ticket.create({ data: input }),
    updateTicket: async (id, input) => {
      try {
        return await prisma.ticket.update({ where: { id }, data: input });
      } catch (error) {
        return translatePrismaError(error);
      }
    },
    deleteTicket: async (id) => {
      try {
        await prisma.ticket.delete({ where: { id } });
      } catch (error) {
        translatePrismaError(error);
      }
    },
  };
}
