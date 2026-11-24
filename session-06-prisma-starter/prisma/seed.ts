import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, TicketPriority, TicketStatus } from "../src/generated/prisma/client.js";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
const tickets = [
  ["Cannot sign in", "The login form rejects a valid password", TicketStatus.open, TicketPriority.high],
  ["Slow dashboard", "Dashboard takes more than ten seconds", TicketStatus.in_progress, TicketPriority.high],
  ["Update billing address", "Customer needs help changing an address", TicketStatus.resolved, TicketPriority.medium],
  ["Missing welcome email", "New account did not receive a welcome email", TicketStatus.open, TicketPriority.medium],
  ["Export report", "CSV export downloads an empty file", TicketStatus.in_progress, TicketPriority.high],
  ["Mobile layout", "Buttons overlap on a small screen", TicketStatus.open, TicketPriority.low],
  ["Reset password", "Password reset link expired too quickly", TicketStatus.resolved, TicketPriority.medium],
  ["Invoice question", "Invoice total does not match the order", TicketStatus.open, TicketPriority.high],
  ["Notification settings", "User cannot disable weekly emails", TicketStatus.in_progress, TicketPriority.low],
  ["Profile avatar", "Uploaded avatar is not displayed", TicketStatus.resolved, TicketPriority.low],
] as const;

for (const [title, description, status, priority] of tickets) {
  const existing = await prisma.ticket.findFirst({ where: { title } });
  if (existing) {
    await prisma.ticket.update({ where: { id: existing.id }, data: { description, status, priority } });
  } else {
    await prisma.ticket.create({ data: { title, description, status, priority } });
  }
}
console.log(`Seeded ${tickets.length} tickets without deleting existing data.`);
await prisma.$disconnect();
await pool.end();
