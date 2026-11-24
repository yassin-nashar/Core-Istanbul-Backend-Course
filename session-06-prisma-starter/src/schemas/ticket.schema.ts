import { z } from "zod";

import { ticketPriorities, ticketStatuses } from "../types/ticket.js";

const requiredText = z.string().trim().min(1, "Text cannot be empty");

export const ticketIdSchema = z.object({
  id: z.uuid("Ticket id must be a valid UUID"),
});

export const createTicketSchema = z.object({
  title: requiredText,
  description: requiredText,
  status: z.enum(ticketStatuses).default("open"),
  priority: z.enum(ticketPriorities).default("medium"),
});

export const updateTicketSchema = z
  .object({
    title: requiredText.optional(),
    description: requiredText.optional(),
    status: z.enum(ticketStatuses).optional(),
    priority: z.enum(ticketPriorities).optional(),
  })
  .refine((input) => Object.keys(input).length > 0, {
    message: "Provide at least one field to update",
  });
