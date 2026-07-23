import type { OnboardingRequest, StudentProfile } from "@mynsut/shared/types/student";
import { Prisma } from "@prisma/client";

import { BRANCHES, isBranchCode } from "../../constants/branches.js";
import { isSectionCode } from "../../constants/sections.js";
import { prisma } from "../../db/prisma.js";
import { resolveExistingClass } from "../classes/classAssignment.service.js";
import { parseUmsRollNumber } from "./rollNumber.service.js";
import { studentErrors } from "./students.errors.js";
import * as studentsRepository from "./students.repository.js";

function mapStudent(
  record: NonNullable<Awaited<ReturnType<typeof studentsRepository.findStudentByUserId>>>
): StudentProfile {
  if (!isBranchCode(record.branchCode)) throw studentErrors.unsupportedBranch();
  if (!isSectionCode(record.section)) throw studentErrors.invalidSection();
  return {
    id: record.id,
    userId: record.userId,
    classId: record.classId,
    umsRollNumber: record.umsRollNumber,
    admissionYear: record.admissionYear,
    branchCode: record.branchCode,
    branchName: BRANCHES[record.branchCode],
    rollNumber: record.rollNumber,
    section: record.section,
    graduationYear: record.graduationYear,
    currentSemester: record.currentSemester,
  };
}

export async function getOwnStudentProfile(userId: string): Promise<StudentProfile> {
  const student = await studentsRepository.findStudentByUserId(prisma, userId);
  if (!student) throw studentErrors.profileNotFound();
  return mapStudent(student);
}

export async function completeOnboarding(
  userId: string,
  input: OnboardingRequest
): Promise<StudentProfile> {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { student: true } });
  if (!user) throw studentErrors.profileNotFound();
  if (user.onboardingCompleted || user.student) throw studentErrors.alreadyOnboarded();

  const parsed = parseUmsRollNumber(input.umsRollNumber);
  const existing = await studentsRepository.findStudentByRollNumber(prisma, parsed.normalizedRollNumber);
  if (existing) throw studentErrors.rollNumberTaken();

  try {
    const student = await prisma.$transaction(async (tx) => {
      const academicClass = await resolveExistingClass(tx, {
        admissionYear: parsed.admissionYear,
        branchCode: parsed.branchCode,
        section: input.section,
      });
      return studentsRepository.createStudentAndCompleteOnboarding(tx, {
        ...parsed,
        userId,
        section: input.section,
        classId: academicClass.id,
      });
    });
    return mapStudent(student);
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw studentErrors.rollNumberTaken();
    }
    throw error;
  }
}
