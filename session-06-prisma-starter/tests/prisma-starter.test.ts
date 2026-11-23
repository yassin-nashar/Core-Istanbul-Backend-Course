import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();

describe("Prisma student starter", () => {
  it("configures PostgreSQL without providing the Ticket solution", async () => {
    const schema = await readFile(join(projectRoot, "prisma", "schema.prisma"), "utf8");

    expect(schema).toContain('provider = "postgresql"');
    expect(schema).toContain('provider = "prisma-client"');
    expect(schema).toContain("TODO");
    expect(schema).not.toMatch(/\bmodel\s+Ticket\b/);
  });

  it("provides Prisma config and a safe environment example", async () => {
    const config = await readFile(join(projectRoot, "prisma.config.ts"), "utf8");
    const example = await readFile(join(projectRoot, ".env.example"), "utf8");
    const gitignore = await readFile(join(projectRoot, ".gitignore"), "utf8");

    expect(config).toContain('schema: "prisma/schema.prisma"');
    expect(config).toContain('process.env["DATABASE_URL"]');
    expect(example).toContain("DATABASE_URL=");
    expect(example).toContain("session_06_training");
    expect(gitignore).toMatch(/^\.env$/m);
  });

  it("does not include student migrations", async () => {
    await expect(access(join(projectRoot, "prisma", "migrations"))).rejects.toThrow();
  });
});
