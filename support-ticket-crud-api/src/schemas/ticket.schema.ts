import { z } from "zod";

const titleSchema = z.string().trim().min(1);
const descriptionSchema = z.string().trim().min(1);
const statusSchema = z.enum(["open", "in_progress", "resolved"]);
const prioritySchema = z.enum(["low", "medium", "high"]);

export const createTicketSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
    status: statusSchema.default("open"),
    priority: prioritySchema.default("medium"),
  })
  .strict();

export const updateTicketSchema = z
  .object({
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    status: statusSchema.optional(),
    priority: prioritySchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one ticket field is required",
  });

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
