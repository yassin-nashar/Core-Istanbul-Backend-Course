import "dotenv/config";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    fileParallelism: false,
    setupFiles: ["tests/setup.ts"],
    env: {
      NODE_ENV: "test",
      JWT_SECRET: "test-secret-that-is-at-least-32-characters-long",
      JWT_ISSUER: "session-07-support-ticket-api",
      JWT_AUDIENCE: "session-07-client",
      ACCESS_TOKEN_TTL: "15m",
      REFRESH_SESSION_TTL_DAYS: "7",
      DATABASE_URL: process.env.TEST_DATABASE_URL ?? "",
    },
  },
});
