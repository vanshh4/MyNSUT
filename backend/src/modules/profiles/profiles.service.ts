import { prisma } from "../../db/prisma.js";
import { ApiError } from "../../utils/apiError.js";
import type { UpdateProfilePayload, OwnProfileProjection, PublicProfileProjection } from "@mynsut/shared/types/profile";
import { mapToOwnProfile, mapToPublicProfile } from "./profileProjection.service.js";

async function getStudentIdByUserId(userId: string) {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!student) throw new ApiError(404, "Student record not found.", { code: "NOT_FOUND" });
  return student.id;
}

export async function getStudentOwnProfile(userId: string): Promise<OwnProfileProjection> {
  const studentId = await getStudentIdByUserId(userId);
  
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      profile: true,
      privacySettings: true,
      academicSummary: {
        include: {
          results: { include: { grades: { include: { subject: true } } } },
          ranks: true
        }
      },
      academicClass: true,
    }
  });

  if (!student) throw new ApiError(404, "Student not found.", { code: "NOT_FOUND" });
  
  return mapToOwnProfile(student);
}

export async function getStudentPeerProfile(requesterUserId: string, targetRollNumber: string): Promise<PublicProfileProjection> {
  // Ensure requester exists
  await getStudentIdByUserId(requesterUserId);
  
  const targetStudent = await prisma.student.findFirst({
    where: { rollNumber: targetRollNumber },
    include: {
      user: true,
      profile: true,
      privacySettings: true,
      academicSummary: {
        include: {
          results: { include: { grades: { include: { subject: true } } } },
          ranks: true
        }
      },
    }
  });

  if (!targetStudent) throw new ApiError(404, "Student not found.", { code: "NOT_FOUND" });
  
  return mapToPublicProfile(targetStudent);
}

export async function updateStudentOwnProfile(
  userId: string,
  payload: UpdateProfilePayload
): Promise<OwnProfileProjection> {
  const studentId = await getStudentIdByUserId(userId);
  
  if (Object.keys(payload).length > 0) {
    await prisma.studentProfile.update({
      where: { studentId },
      data: payload,
    });
  }
  
  return getStudentOwnProfile(userId);
}
