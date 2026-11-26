import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/error.middleware.js";
import type { CreateTicketInput, TicketFilters, UpdateTicketInput } from "../types/ticket.js";

type TicketRecord = Prisma.TicketGetPayload<object>;
type AuthenticatedUser = { id: string; role: "USER" | "ADMIN" };

export interface TicketService {
  listTickets(user: AuthenticatedUser, filters?: TicketFilters): Promise<TicketRecord[]>;
  getTicketById(id: string, user: AuthenticatedUser): Promise<TicketRecord>;
  createTicket(input: CreateTicketInput, user: AuthenticatedUser): Promise<TicketRecord>;
  updateTicket(id: string, input: UpdateTicketInput, user: AuthenticatedUser): Promise<TicketRecord>;
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
    listTickets: (user, filters = {}) => prisma.ticket.findMany({ where: { ...filters, ...(user.role === "USER" ? { ownerId: user.id } : {}) } }),
    getTicketById: async (id, user) => {
      const ticket = await prisma.ticket.findFirst({ where: { id, ...(user.role === "USER" ? { ownerId: user.id } : {}) } });
      if (!ticket) throw new AppError(404, "Ticket not found");
      return ticket;
    },
    createTicket: (input, user) => prisma.ticket.create({ data: { ...input, ownerId: user.id } }),
    updateTicket: async (id, input, user) => {
      try {
        if (user.role === "ADMIN") return await prisma.ticket.update({ where: { id }, data: input });
        const updated = await prisma.ticket.updateMany({ where: { id, ownerId: user.id }, data: input });
        if (updated.count !== 1) throw new AppError(404, "Ticket not found");
        return await prisma.ticket.findUniqueOrThrow({ where: { id } });
      } catch (error) {
        if (error instanceof AppError) throw error;
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
