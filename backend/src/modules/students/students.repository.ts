import type { Prisma, PrismaClient } from "@prisma/client";

import { ROLES } from "../../constants/roles.js";
import type { ParsedRollNumber } from "./students.types.js";

export type StudentDatabaseClient = PrismaClient | Prisma.TransactionClient;

export function findStudentByUserId(client: StudentDatabaseClient, userId: string) {
  return client.student.findUnique({
    where: { userId },
    include: { academicClass: true, user: true },
  });
}

export function findStudentByRollNumber(client: StudentDatabaseClient, umsRollNumber: string) {
  return client.student.findUnique({ where: { umsRollNumber } });
}

export async function createStudentAndCompleteOnboarding(
  client: Prisma.TransactionClient,
  input: ParsedRollNumber & { userId: string; section: string; classId: string }
) {
  const studentRole = await client.role.findUnique({ where: { code: ROLES.STUDENT } });
  if (!studentRole) throw new Error("The STUDENT role has not been seeded.");

  const student = await client.student.create({
    data: {
      userId: input.userId,
      umsRollNumber: input.normalizedRollNumber,
      admissionYear: input.admissionYear,
      branchCode: input.branchCode,
      rollNumber: input.rollNumber,
      section: input.section,
      graduationYear: input.graduationYear,
      currentSemester: null,
      classId: input.classId,
    },
    include: { academicClass: true, user: true },
  });

  await client.user.update({
    where: { id: input.userId },
    data: { onboardingCompleted: true },
  });

  await client.userGlobalRole.upsert({
    where: { userId_roleId: { userId: input.userId, roleId: studentRole.id } },
    update: {},
    create: { userId: input.userId, roleId: studentRole.id },
  });

  return student;
}
