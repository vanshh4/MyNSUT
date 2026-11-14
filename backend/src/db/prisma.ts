import { PrismaClient } from "@prisma/client";

import { appConfig } from "../config/app.js";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: appConfig.isDevelopment ? ["warn", "error"] : ["error"],
  });

if (!appConfig.isProduction) {
  globalForPrisma.prisma = prisma;
}

/**
 * Probes the database to verify live connectivity and measures round-trip latency.
 * Safe to call from health checks and readiness probes.
 */
export async function checkDatabaseHealth(timeoutMs: number = 3000): Promise<{
  connected: boolean;
  latencyMs: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    const probe = prisma.$queryRaw`SELECT 1 as live`;
    const timeout = new Promise<never>((_, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Database health check timed out"));
      }, timeoutMs);
      timer.unref?.();
    });

    await Promise.race([probe, timeout]);

    return {
      connected: true,
      latencyMs: Date.now() - start,
    };
  } catch (error) {
    return {
      connected: false,
      latencyMs: Date.now() - start,
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }
}
