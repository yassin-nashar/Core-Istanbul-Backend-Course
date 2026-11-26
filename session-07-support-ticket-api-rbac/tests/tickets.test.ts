import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { signAccessToken } from "../src/lib/access-token.js";
import { prisma } from "../src/lib/prisma.js";

const app = createApp();
let userOne: { id: string };
let userTwo: { id: string };
let admin: { id: string };
const auth = (id: string) => ({ Authorization: `Bearer ${signAccessToken(id)}` });

beforeEach(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
  [userOne, userTwo, admin] = await Promise.all([
    prisma.user.create({ data: { name: "User One", email: "user1@example.com", passwordHash: "test-only", role: "USER" } }),
    prisma.user.create({ data: { name: "User Two", email: "user2@example.com", passwordHash: "test-only", role: "USER" } }),
    prisma.user.create({ data: { name: "Admin", email: "admin@example.com", passwordHash: "test-only", role: "ADMIN" } }),
  ]);
});

async function createTicket(ownerId: string, title = "Owned ticket") {
  return prisma.ticket.create({ data: { title, description: "Ticket description", ownerId } });
}

describe("ticket RBAC and resource ownership", () => {
  it("rejects unauthenticated requests", async () => {
    expect((await request(app).get("/api/tickets")).status).toBe(401);
    expect((await request(app).post("/api/tickets").send({ title: "A", description: "B" })).status).toBe(401);
  });

  it("creates tickets for the authenticated user and ignores client ownerId", async () => {
    const response = await request(app).post("/api/tickets").set(auth(userOne.id)).send({ title: "  New ticket  ", description: "  Details  ", ownerId: userTwo.id });
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ title: "New ticket", description: "Details", ownerId: userOne.id });
  });

  it("lists only a USER's tickets while ADMIN lists all tickets", async () => {
    await createTicket(userOne.id, "One");
    await createTicket(userTwo.id, "Two");
    const own = await request(app).get("/api/tickets").set(auth(userOne.id));
    const all = await request(app).get("/api/tickets").set(auth(admin.id));
    expect(own.body.map((ticket: { title: string }) => ticket.title)).toEqual(["One"]);
    expect(all.body).toHaveLength(2);
  });

  it("returns 404 when a USER views another user's ticket", async () => {
    const ticket = await createTicket(userTwo.id);
    expect((await request(app).get(`/api/tickets/${ticket.id}`).set(auth(userOne.id))).status).toBe(404);
    expect((await request(app).get(`/api/tickets/${ticket.id}`).set(auth(admin.id))).status).toBe(200);
  });

  it("allows USER to update own ticket but not another user's or ownerId", async () => {
    const own = await createTicket(userOne.id, "Own");
    const other = await createTicket(userTwo.id, "Other");
    expect((await request(app).patch(`/api/tickets/${own.id}`).set(auth(userOne.id)).send({ status: "resolved", ownerId: userTwo.id })).status).toBe(200);
    expect((await prisma.ticket.findUniqueOrThrow({ where: { id: own.id } })).ownerId).toBe(userOne.id);
    expect((await request(app).patch(`/api/tickets/${other.id}`).set(auth(userOne.id)).send({ status: "resolved" })).status).toBe(404);
  });

  it("allows ADMIN to update any ticket", async () => {
    const ticket = await createTicket(userOne.id);
    const response = await request(app).patch(`/api/tickets/${ticket.id}`).set(auth(admin.id)).send({ priority: "high" });
    expect(response.status).toBe(200);
    expect(response.body.priority).toBe("high");
  });

  it("forbids USER deletion and allows ADMIN deletion", async () => {
    const ticket = await createTicket(userOne.id);
    expect((await request(app).delete(`/api/tickets/${ticket.id}`).set(auth(userOne.id))).status).toBe(403);
    const deleted = await request(app).delete(`/api/tickets/${ticket.id}`).set(auth(admin.id));
    expect(deleted.status).toBe(204);
    expect(deleted.text).toBe("");
  });

  it("uses the current database role rather than a stale JWT role", async () => {
    const token = signAccessToken(userOne.id);
    await prisma.user.update({ where: { id: userOne.id }, data: { role: "ADMIN" } });
    const ticket = await createTicket(userTwo.id);
    expect((await request(app).delete(`/api/tickets/${ticket.id}`).set("Authorization", `Bearer ${token}`)).status).toBe(204);

    const staleAdminToken = signAccessToken(admin.id);
    await prisma.user.update({ where: { id: admin.id }, data: { role: "USER" } });
    const protectedTicket = await createTicket(userTwo.id, "Protected after demotion");
    expect((await request(app).delete(`/api/tickets/${protectedTicket.id}`).set("Authorization", `Bearer ${staleAdminToken}`)).status).toBe(403);
  });
});
