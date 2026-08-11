import type { StudentAcademicSummary, SemesterResult } from "@mynsut/shared/types/academic";
import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export async function getAcademicSummary(rollNumber: string): Promise<StudentAcademicSummary> {
  const response = await apiClient<StudentAcademicSummary>(apiEndpoints.academics.summary(rollNumber), {
    method: "GET",
    cache: "no-store",
  });
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function getSemesterResult(rollNumber: string, semester: number): Promise<SemesterResult> {
  const response = await apiClient<SemesterResult>(apiEndpoints.academics.semester(rollNumber, semester), {
    method: "GET",
    cache: "no-store",
  });
  if (!response.success) throw new Error(response.message);
  return response.data;
}
