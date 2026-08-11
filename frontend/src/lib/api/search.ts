import type { PublicProfileProjection } from "@mynsut/shared/types/profile";
import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export async function searchStudents(query: string): Promise<PublicProfileProjection[]> {
  const params = new URLSearchParams({ q: query });
  const response = await apiClient<PublicProfileProjection[]>(`${apiEndpoints.search.students}?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!response.success) throw new Error(response.message);
  return response.data;
}
