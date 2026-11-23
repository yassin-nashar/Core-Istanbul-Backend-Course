export const ticketStatuses = ["open", "in_progress", "resolved"] as const;
export const ticketPriorities = ["low", "medium", "high"] as const;

export type TicketStatus = (typeof ticketStatuses)[number];
export type TicketPriority = (typeof ticketPriorities)[number];

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
}

export type CreateTicketInput = Pick<Ticket, "title" | "description" | "status" | "priority">;
export type UpdateTicketInput = Partial<CreateTicketInput>;
