import type { Server } from "node:http";

import { app } from "./app.js";
import { appConfig } from "./config/app.js";
import { prisma } from "./db/prisma.js";

let server: Server | undefined;
let shuttingDown = false;

async function startServer() {
  await prisma.$connect();

  server = app.listen(appConfig.port, () => {
    console.log(
      `${appConfig.name} is running at http://localhost:${appConfig.port}${appConfig.apiPrefix}`
    );
  });
}

async function shutdown(signal: NodeJS.Signals) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received. Shutting down gracefully.`);

  const forceExitTimer = setTimeout(() => {
    console.error("Graceful shutdown timed out. Forcing process exit.");
    process.exit(1);
  }, 10_000);
  forceExitTimer.unref();

  if (server) {
    await new Promise<void>((resolve, reject) => {
      server?.close((error) => (error ? reject(error) : resolve()));
    });
  }

  await prisma.$disconnect();
  process.exit(0);
}

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    void shutdown(signal);
  });
}

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
  void shutdown("SIGTERM");
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  void shutdown("SIGTERM");
});

startServer().catch(async (error: unknown) => {
  console.error("Failed to start MyNSUT API:", error);
  await prisma.$disconnect();
  process.exit(1);
});
