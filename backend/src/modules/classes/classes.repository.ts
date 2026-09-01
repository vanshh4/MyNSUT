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

export function findClassById(client: ClassDatabaseClient, classId: string) {
  return client.academicClass.findUnique({
    where: { id: classId },
  });
}

export function findClassMembers(client: ClassDatabaseClient, classId: string) {
  return client.student.findMany({
    where: { classId },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profileImageUrl: true,
        },
      },
    },
    orderBy: { rollNumber: "asc" },
  });
}

export function findActiveCrRoleForStudent(client: ClassDatabaseClient, classId: string, userId: string) {
  return client.classRole.findFirst({
    where: {
      classId,
      userId,
      role: { code: "CLASS_CR" },
      revokedAt: null,
    },
  });
}

export function assignCrRole(client: ClassDatabaseClient, classId: string, userId: string, assignedBy: string) {
  const data = {
    class: { connect: { id: classId } },
    user: { connect: { id: userId } },
    role: { connect: { code: "CLASS_CR" } },
  } as any;
  if (assignedBy) data.assigner = { connect: { id: assignedBy } };
  return client.classRole.create({ data });
}

export function revokeCrRole(client: ClassDatabaseClient, classRoleId: string, revokedBy: string) {
  return client.classRole.update({
    where: { id: classRoleId },
    data: {
      revokedAt: new Date(),
      revokedBy,
    },
  });
}

export function listClasses(client: ClassDatabaseClient) {
  return client.academicClass.findMany({
    orderBy: [
      { admissionYear: "desc" },
      { branchCode: "asc" },
      { section: "asc" },
    ],
  });
}

