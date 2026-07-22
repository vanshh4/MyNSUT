import type { Prisma, PrismaClient } from "@prisma/client";

import { studentErrors } from "../students/students.errors.js";
import { findClassByIdentity } from "./classes.repository.js";
import type { AssignedClass, ClassIdentity } from "./classes.types.js";

export async function resolveExistingClass(
  client: PrismaClient | Prisma.TransactionClient,
  identity: ClassIdentity
): Promise<AssignedClass> {
  const academicClass = await findClassByIdentity(client, identity);
  if (!academicClass || academicClass.status !== "ACTIVE") throw studentErrors.classNotFound();

  return {
    id: academicClass.id,
    name: academicClass.name,
    admissionYear: academicClass.admissionYear,
    branchCode: academicClass.branchCode as AssignedClass["branchCode"],
    section: academicClass.section as AssignedClass["section"],
  };
}
