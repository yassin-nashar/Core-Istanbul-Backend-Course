import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { signAccessToken } from "../src/lib/access-token.js";
let app = createApp();
const authorization = () => ({ Authorization: `Bearer ${signAccessToken("test-user")}` });

beforeEach(async () => {
  await prisma.ticket.deleteMany();
  app = createApp();
});

async function createTicket(overrides: Record<string, unknown> = {}) {
  return request(app)
    .post("/api/tickets")
    .set(authorization())
    .send({
      title: "  Cannot sign in  ",
      description: "  The login form rejects my password.  ",
      ...overrides,
    });
}

describe("ticket CRUD", () => {
  it("creates a trimmed ticket with server defaults", async () => {
    const response = await createTicket();

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      title: "Cannot sign in",
      description: "The login form rejects my password.",
      status: "open",
      priority: "medium",
    });
    expect(response.body.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(new Date(response.body.createdAt).toISOString()).toBe(response.body.createdAt);
  });

  it("lists tickets and returns one by id", async () => {
    const created = await createTicket({ priority: "high" });

    const list = await request(app).get("/api/tickets").set(authorization());
    const detail = await request(app).get(`/api/tickets/${created.body.id}`).set(authorization());

    expect(list.status).toBe(200);
    expect(list.body).toEqual([created.body]);
    expect(detail.status).toBe(200);
    expect(detail.body).toEqual(created.body);
  });

  it("updates only supplied fields", async () => {
    const created = await createTicket();

    const response = await request(app)
      .patch(`/api/tickets/${created.body.id}`)
      .set(authorization())
      .send({ title: "  Login issue resolved  ", status: "resolved" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      title: "Login issue resolved",
      description: "The login form rejects my password.",
      status: "resolved",
      priority: "medium",
    });
  });

  it("deletes a ticket with an empty 204 response", async () => {
    const created = await createTicket();

    const deleted = await request(app).delete(`/api/tickets/${created.body.id}`).set(authorization());
    const missing = await request(app).get(`/api/tickets/${created.body.id}`).set(authorization());

    expect(deleted.status).toBe(204);
    expect(deleted.text).toBe("");
    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({ error: { message: "Ticket not found" } });
  });
});

describe("ticket validation", () => {
  it("returns 400 for malformed JSON", async () => {
    const response = await request(app)
      .post("/api/tickets")
      .set(authorization())
      .set("Content-Type", "application/json")
      .send('{"title":');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: { message: "Invalid JSON body" } });
  });

  it.each([
    { title: "   ", description: "Valid description" },
    { title: "Valid title", description: "   " },
  ])("rejects blank required text", async (payload) => {
    const response = await request(app).post("/api/tickets").set(authorization()).send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error.message");
  });

  it.each([
    { status: "closed" },
    { priority: "urgent" },
  ])("rejects invalid enum values", async (override) => {
    const response = await createTicket(override);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error.message");
  });

  it("rejects an empty patch body", async () => {
    const created = await createTicket();
    const response = await request(app).patch(`/api/tickets/${created.body.id}`).set(authorization()).send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error.message");
  });

  it("returns 400 for a malformed ticket id", async () => {
    const response = await request(app).get("/api/tickets/not-a-uuid").set(authorization());

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error.message");
  });

  it("returns 404 for a valid but missing ticket id", async () => {
    const response = await request(app).get("/api/tickets/00000000-0000-4000-8000-000000000000").set(authorization());

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: { message: "Ticket not found" } });
  });
});

describe("ticket authentication", () => {
  it("rejects all ticket operations without an access token", async () => {
    for (const call of [request(app).get("/api/tickets"), request(app).post("/api/tickets").send({}), request(app).patch("/api/tickets/00000000-0000-4000-8000-000000000000").send({}), request(app).delete("/api/tickets/00000000-0000-4000-8000-000000000000")]) {
      const response = await call;
      expect(response.status).toBe(401);
      expect(response.headers["www-authenticate"]).toBeDefined();
    }
  });
});
