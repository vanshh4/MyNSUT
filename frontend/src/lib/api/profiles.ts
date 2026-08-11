import type { OwnProfileProjection, PublicProfileProjection, UpdateProfilePayload } from "@mynsut/shared/types/profile";
import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export async function getOwnProfile(): Promise<OwnProfileProjection> {
  const response = await apiClient<OwnProfileProjection>(apiEndpoints.profiles.me, {
    method: "GET",
    cache: "no-store",
  });
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function getPeerProfile(rollNumber: string): Promise<PublicProfileProjection> {
  const response = await apiClient<PublicProfileProjection>(apiEndpoints.profiles.peer(rollNumber), {
    method: "GET",
    cache: "no-store",
  });
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function updateOwnProfile(payload: UpdateProfilePayload): Promise<OwnProfileProjection> {
  const response = await apiClient<OwnProfileProjection>(apiEndpoints.profiles.me, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!response.success) throw new Error(response.message);
  return response.data;
}
