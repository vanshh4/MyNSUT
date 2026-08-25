import type { StudentAcademicSummary, SemesterResult } from "@mynsut/shared/types/academic";
import { ApiError } from "../../utils/apiError.js";
import { prisma } from "../../db/prisma.js";
import { PROFILE_VISIBILITY } from "@mynsut/shared/constants/profileVisibility";

export async function getStudentAcademicSummary(requesterUserId: string, targetRollNumber: string): Promise<StudentAcademicSummary> {
  const targetStudent = await prisma.student.findFirst({
    where: { rollNumber: targetRollNumber },
    include: {
      privacySettings: true,
    }
  });

  if (!targetStudent) throw new ApiError(404, "Student not found.", { code: "NOT_FOUND" });

  // Check if requester is the target
  const isOwner = targetStudent.userId === requesterUserId;

  if (!isOwner) {
    const visibility = targetStudent.privacySettings?.academicSummaryVisibility;
    if (visibility !== PROFILE_VISIBILITY.PUBLIC && visibility !== PROFILE_VISIBILITY.PLATFORM_ONLY) {
      throw new ApiError(403, "You do not have permission to view this academic summary.", { code: "FORBIDDEN" });
    }
  }

  // As per phase 4 guidelines, no academic data is populated.
  // Return Unavailable exception that frontend handles gracefully.
  throw new ApiError(404, "Academic data is currently unavailable.", { code: "NOT_FOUND" });
}

export async function getStudentSemesterResult(requesterUserId: string, targetRollNumber: string, semester: number): Promise<SemesterResult> {
  const targetStudent = await prisma.student.findFirst({
    where: { rollNumber: targetRollNumber },
    include: {
      privacySettings: true,
    }
  });

  if (!targetStudent) throw new ApiError(404, "Student not found.", { code: "NOT_FOUND" });

  const isOwner = targetStudent.userId === requesterUserId;

  if (!isOwner) {
    const visibility = targetStudent.privacySettings?.semesterResultsVisibility;
    if (visibility !== PROFILE_VISIBILITY.PUBLIC && visibility !== PROFILE_VISIBILITY.PLATFORM_ONLY) {
      throw new ApiError(403, "You do not have permission to view this semester result.", { code: "FORBIDDEN" });
    }
  }

  throw new ApiError(404, "Academic data is currently unavailable.", { code: "NOT_FOUND" });
}
