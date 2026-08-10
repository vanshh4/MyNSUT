import { prisma } from "../../db/prisma.js";
import type { PublicProfileProjection } from "@mynsut/shared/types/profile";
import { mapToPublicProfile } from "../profiles/profileProjection.service.js";
import { Prisma } from "@prisma/client";

export async function performStudentSearch(query: string): Promise<PublicProfileProjection[]> {
  // We search across rollNumber, full name (on User), branch, and admissionYear
  // For safety against regex injection/complex queries, we use basic Prisma 'contains'
  const searchString = query.trim();

  // Handle year conversion safely if query looks like a year
  const yearQuery = parseInt(searchString, 10);
  const isYear = !isNaN(yearQuery) && yearQuery > 2000 && yearQuery < 2100;

  const students = await prisma.student.findMany({
    where: {
      OR: [
        { rollNumber: { contains: searchString, mode: 'insensitive' } },
        { branchCode: { contains: searchString, mode: 'insensitive' } },
        { user: { fullName: { contains: searchString, mode: 'insensitive' } } },
        ...(isYear ? [{ admissionYear: yearQuery }] : []),
      ]
    },
    take: 50, // limit results for performance and safety
    include: {
      profile: true,
      privacySettings: true,
      user: true, // Needed for fullName mapping
      academicSummary: {
        include: {
          results: { include: { grades: { include: { subject: true } } } },
          ranks: true
        }
      },
    }
  });

  return students.map((student: any) => mapToPublicProfile(student));
}
