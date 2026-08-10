import type { StudentPrivacySettings, UpdatePrivacyPayload } from "@mynsut/shared/types/privacy";
import { prisma } from "../../db/prisma.js";
import { ApiError } from "../../utils/apiError.js";

async function getStudentIdByUserId(userId: string): Promise<string> {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!student) {
    throw new ApiError(404, "Student record not found.", { code: "NOT_FOUND" });
  }
  return student.id;
}

export async function getOwnPrivacySettings(userId: string): Promise<StudentPrivacySettings> {
  const studentId = await getStudentIdByUserId(userId);
  const settings = await prisma.studentPrivacySettings.findUnique({
    where: { studentId },
  });
  
  if (!settings) {
    throw new ApiError(404, "Privacy settings not found.", { code: "NOT_FOUND" });
  }
  
  return {
    id: settings.id,
    studentId: settings.studentId,
    bioVisibility: settings.bioVisibility,
    socialLinksVisibility: settings.socialLinksVisibility,
    academicSummaryVisibility: settings.academicSummaryVisibility,
    semesterResultsVisibility: settings.semesterResultsVisibility,
    updatedAt: settings.updatedAt,
  };
}

export async function updateOwnPrivacySettings(
  userId: string,
  payload: UpdatePrivacyPayload
): Promise<StudentPrivacySettings> {
  const studentId = await getStudentIdByUserId(userId);
  
  if (Object.keys(payload).length === 0) {
    return getOwnPrivacySettings(userId);
  }
  
  const settings = await prisma.studentPrivacySettings.update({
    where: { studentId },
    data: payload,
  });
  
  return {
    id: settings.id,
    studentId: settings.studentId,
    bioVisibility: settings.bioVisibility,
    socialLinksVisibility: settings.socialLinksVisibility,
    academicSummaryVisibility: settings.academicSummaryVisibility,
    semesterResultsVisibility: settings.semesterResultsVisibility,
    updatedAt: settings.updatedAt,
  };
}
