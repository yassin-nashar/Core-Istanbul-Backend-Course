import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, TicketPriority, TicketStatus, UserRole } from "../src/generated/prisma/client.js";
import { hashPassword } from "../src/lib/password.js";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
const passwordHash = await hashPassword("ClassroomPassword123");

async function upsertUser(name: string, email: string, role: UserRole) {
  return prisma.user.upsert({ where: { email }, update: { name, role }, create: { name, email, role, passwordHash } });
}

const admin = await upsertUser("Course Admin", "admin@example.com", UserRole.ADMIN);
const userOne = await upsertUser("User One", "user1@example.com", UserRole.USER);
const userTwo = await upsertUser("User Two", "user2@example.com", UserRole.USER);
const examples = [
  ["Cannot sign in", "Valid password is rejected", TicketStatus.open, TicketPriority.high],
  ["Slow dashboard", "Dashboard takes ten seconds", TicketStatus.in_progress, TicketPriority.high],
  ["Billing address", "Address needs correction", TicketStatus.resolved, TicketPriority.medium],
  ["Missing email", "Welcome email was not received", TicketStatus.open, TicketPriority.medium],
  ["Mobile layout", "Buttons overlap on mobile", TicketStatus.in_progress, TicketPriority.low],
] as const;

for (const [user, suffix] of [[userOne, "User 1"], [userTwo, "User 2"]] as const) {
  for (const [title, description, status, priority] of examples) {
    const ownedTitle = `${title} (${suffix})`;
    const existing = await prisma.ticket.findFirst({ where: { title: ownedTitle, ownerId: user.id } });
    if (existing) await prisma.ticket.update({ where: { id: existing.id }, data: { description, status, priority } });
    else await prisma.ticket.create({ data: { title: ownedTitle, description, status, priority, ownerId: user.id } });
  }
}

console.log(`Seeded development accounts: ${admin.email}, ${userOne.email}, ${userTwo.email}`);
await prisma.$disconnect();
await pool.end();
