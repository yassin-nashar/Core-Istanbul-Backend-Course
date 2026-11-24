import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

const originalCwd = process.cwd();
const originalPort = process.env.PORT;
let temporaryDirectory: string | undefined;

afterEach(async () => {
  process.chdir(originalCwd);
  if (originalPort === undefined) {
    delete process.env.PORT;
  } else {
    process.env.PORT = originalPort;
  }
  if (temporaryDirectory) {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

describe("server environment", () => {
  it("loads PORT from a local .env file", async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), "session06-env-"));
    await writeFile(join(temporaryDirectory, ".env"), "PORT=3456\n", "utf8");
    delete process.env.PORT;
    process.chdir(temporaryDirectory);

    vi.resetModules();
    const { port } = await import("../src/config/env.js");

    expect(port).toBe(3456);
  });
});
