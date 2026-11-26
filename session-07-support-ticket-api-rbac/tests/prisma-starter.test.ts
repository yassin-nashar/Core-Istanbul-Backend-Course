import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();

describe("Prisma instructor solution", () => {
  it("defines the complete Ticket model", async () => {
    const schema = await readFile(join(projectRoot, "prisma", "schema.prisma"), "utf8");

    expect(schema).toContain('provider = "postgresql"');
    expect(schema).toContain('provider = "prisma-client"');
    expect(schema).toMatch(/\bmodel\s+Ticket\b/);
    expect(schema).toMatch(/\bid\s+String\s+@id\s+@default\(uuid\(\)\)/);
    expect(schema).toMatch(/\btitle\s+String\b/);
    expect(schema).toMatch(/\bdescription\s+String\b/);
    expect(schema).toMatch(/\bstatus\s+TicketStatus\s+@default\(open\)/);
    expect(schema).toMatch(/\bpriority\s+TicketPriority\s+@default\(medium\)/);
    expect(schema).toMatch(/\bcreatedAt\s+DateTime\s+@default\(now\(\)\)/);
  });

  it("provides Prisma config and a safe environment example", async () => {
    const config = await readFile(join(projectRoot, "prisma.config.ts"), "utf8");
    const example = await readFile(join(projectRoot, ".env.example"), "utf8");
    const gitignore = await readFile(join(projectRoot, ".gitignore"), "utf8");

    expect(config).toContain('schema: "prisma/schema.prisma"');
    expect(config).toContain('process.env["DATABASE_URL"]');
    expect(example).toContain("DATABASE_URL=");
    expect(example).toContain("session_07_support_tickets");
    expect(example).toContain("JWT_SECRET=");
    expect(gitignore).toMatch(/^\.env$/m);
  });

  it("includes an initial SQL migration", async () => {
    const migrationRoot = join(projectRoot, "prisma", "migrations");
    const directories = await readdir(migrationRoot, { withFileTypes: true });
    const initial = directories.find((entry) => entry.isDirectory() && entry.name.endsWith("_init"));

    expect(initial).toBeDefined();
    const sql = await readFile(join(migrationRoot, initial!.name, "migration.sql"), "utf8");
    expect(sql).toContain('CREATE TABLE "Ticket"');
    expect(sql).toContain('PRIMARY KEY ("id")');
  });
});
