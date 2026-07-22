import type { Prisma, PrismaClient } from "@prisma/client";

import type { ClassIdentity } from "./classes.types.js";

export type ClassDatabaseClient = PrismaClient | Prisma.TransactionClient;

export function findClassByIdentity(client: ClassDatabaseClient, identity: ClassIdentity) {
  return client.academicClass.findUnique({
    where: {
      admissionYear_branchCode_section: {
        admissionYear: identity.admissionYear,
        branchCode: identity.branchCode,
        section: identity.section,
      },
    },
  });
}
