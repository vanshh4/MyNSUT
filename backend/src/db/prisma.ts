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
