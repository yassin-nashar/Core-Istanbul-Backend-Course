import { disconnectPrisma } from "../lib/prisma.js";

export function registerShutdownHandlers(server: { close(callback?: (error?: Error) => void): void }): void {
  let shuttingDown = false;
  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`${signal} received. Closing resources...`);
    server.close(async (error) => {
      await disconnectPrisma();
      if (error) process.exitCode = 1;
    });
  };
  process.once("SIGINT", () => void shutdown("SIGINT"));
  process.once("SIGTERM", () => void shutdown("SIGTERM"));
}
