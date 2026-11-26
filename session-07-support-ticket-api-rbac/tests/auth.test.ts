import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import jwt from "jsonwebtoken";
import { env } from "../src/config/env.js";

const app = createApp();
const account = { name: "Example User", email: "USER@Example.com", password: "ExampleStrongPassword123" };

beforeEach(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
});

describe("authentication lifecycle", () => {
  it("registers safely, hashes passwords with Argon2id, and rejects duplicates", async () => {
    const first = await request(app).post("/api/auth/register").send(account);
    const stored = await prisma.user.findUniqueOrThrow({ where: { email: "user@example.com" } });
    const duplicate = await request(app).post("/api/auth/register").send(account);
    expect(first.status).toBe(201);
    expect(first.body.user).not.toHaveProperty("passwordHash");
    expect(stored.passwordHash).toMatch(/^\$argon2id\$/);
    expect(stored.passwordHash).not.toContain(account.password);
    expect(stored.role).toBe("USER");
    expect(duplicate.status).toBe(409);
    const second = await request(app).post("/api/auth/register").send({ ...account, email: "second@example.com" });
    const secondStored = await prisma.user.findUniqueOrThrow({ where: { email: "second@example.com" } });
    expect(second.status).toBe(201);
    expect(secondStored.passwordHash).not.toBe(stored.passwordHash);
  });

  it("rejects invalid registration and resolves duplicate races safely", async () => {
    expect((await request(app).post("/api/auth/register").send({ name: "", email: "bad", password: "short" })).status).toBe(400);
    const raced = await Promise.all([request(app).post("/api/auth/register").send(account), request(app).post("/api/auth/register").send(account)]);
    expect(raced.map((result) => result.status).sort()).toEqual([201, 409]);
  });

  it("does not allow public registration to self-assign ADMIN", async () => {
    const response = await request(app).post("/api/auth/register").send({ ...account, role: "ADMIN" });
    const stored = await prisma.user.findUniqueOrThrow({ where: { email: account.email.toLowerCase() } });
    expect(response.status).toBe(201);
    expect(stored.role).toBe("USER");
  });

  it("logs in, stores only a refresh hash, rotates it, and rejects reuse", async () => {
    await request(app).post("/api/auth/register").send(account);
    const login = await request(app).post("/api/auth/login").send({ email: account.email, password: account.password });
    const oldCookie = login.headers["set-cookie"]?.[0] as string;
    expect(login.status).toBe(200);
    expect(login.body.accessToken).toEqual(expect.any(String));
    expect(oldCookie).toContain("HttpOnly");
    const raw = oldCookie.split(";")[0]!.split("=")[1]!;
    const stored = await prisma.refreshToken.findFirstOrThrow();
    expect(stored.tokenHash).not.toBe(raw);

    const refreshed = await request(app).post("/api/auth/refresh").set("Cookie", oldCookie);
    expect(refreshed.status).toBe(200);
    const replacement = await prisma.refreshToken.findFirstOrThrow({ where: { replacedById: null, consumedAt: null } });
    expect(replacement.expiresAt.getTime()).toBe(stored.expiresAt.getTime());
    const reused = await request(app).post("/api/auth/refresh").set("Cookie", oldCookie);
    expect(reused.status).toBe(401);
    expect(await prisma.refreshToken.count({ where: { familyId: stored.familyId, revokedAt: null } })).toBe(0);
  });

  it("rejects invalid credentials and revokes only the logged-out session", async () => {
    await request(app).post("/api/auth/register").send(account);
    expect((await request(app).post("/api/auth/login").send({ email: account.email, password: "wrong" })).status).toBe(401);
    const first = await request(app).post("/api/auth/login").send({ email: account.email, password: account.password });
    const second = await request(app).post("/api/auth/login").send({ email: account.email, password: account.password });
    expect((await request(app).post("/api/auth/logout").set("Cookie", first.headers["set-cookie"]![0]!)).status).toBe(204);
    expect((await request(app).post("/api/auth/refresh").set("Cookie", first.headers["set-cookie"]![0]!)).status).toBe(401);
    expect((await request(app).post("/api/auth/refresh").set("Cookie", second.headers["set-cookie"]![0]!)).status).toBe(200);
    expect((await request(app).post("/api/auth/logout")).status).toBe(204);
    expect((await request(app).post("/api/auth/logout")).status).toBe(204);
  });

  it("rejects expired refresh tokens and malformed JSON cookies safely", async () => {
    await request(app).post("/api/auth/register").send(account);
    const login = await request(app).post("/api/auth/login").send({ email: account.email, password: account.password });
    await prisma.refreshToken.updateMany({ data: { expiresAt: new Date(Date.now() - 1) } });
    expect((await request(app).post("/api/auth/refresh").set("Cookie", login.headers["set-cookie"]![0]!)).status).toBe(401);
    const malformed = "refresh_token=j%3A%7B%22key%22%3A%22value%22%7D";
    expect((await request(app).post("/api/auth/refresh").set("Cookie", malformed)).status).toBe(401);
    expect((await request(app).post("/api/auth/logout").set("Cookie", malformed)).status).toBe(204);
  });

  it("issues constrained access claims and rejects tampered tokens", async () => {
    await request(app).post("/api/auth/register").send(account);
    const login = await request(app).post("/api/auth/login").send({ email: account.email, password: account.password });
    const payload = jwt.verify(login.body.accessToken, env.JWT_SECRET, { algorithms: ["HS256"], issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE });
    expect(payload).toMatchObject({ tokenType: "access" });
    expect(typeof payload).not.toBe("string");
    const tampered = `${login.body.accessToken.slice(0, -1)}x`;
    expect((await request(app).get("/api/tickets").set("Authorization", `Bearer ${tampered}`)).status).toBe(401);
    const missingExpiry = jwt.sign({ tokenType: "access" }, env.JWT_SECRET, { algorithm: "HS256", issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE, subject: "user-id", noTimestamp: true });
    expect((await request(app).get("/api/tickets").set("Authorization", `Bearer ${missingExpiry}`)).status).toBe(401);
  });

  it("allows only one of two concurrent rotations", async () => {
    await request(app).post("/api/auth/register").send(account);
    const login = await request(app).post("/api/auth/login").send({ email: account.email, password: account.password });
    const cookie = login.headers["set-cookie"]![0]!;
    const results = await Promise.all([
      request(app).post("/api/auth/refresh").set("Cookie", cookie),
      request(app).post("/api/auth/refresh").set("Cookie", cookie),
    ]);
    expect(results.map((result) => result.status).sort()).toEqual([200, 401]);
    const original = await prisma.refreshToken.findFirstOrThrow();
    expect(await prisma.refreshToken.count({ where: { familyId: original.familyId, revokedAt: null } })).toBe(0);
  });
});
