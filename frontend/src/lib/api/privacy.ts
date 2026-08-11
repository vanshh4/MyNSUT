import type { StudentPrivacySettings, UpdatePrivacyPayload } from "@mynsut/shared/types/privacy";
import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export async function getPrivacySettings(): Promise<StudentPrivacySettings> {
  const response = await apiClient<StudentPrivacySettings>(apiEndpoints.privacy.me, {
    method: "GET",
    cache: "no-store",
  });
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function updatePrivacySettings(payload: UpdatePrivacyPayload): Promise<StudentPrivacySettings> {
  const response = await apiClient<StudentPrivacySettings>(apiEndpoints.privacy.me, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!response.success) throw new Error(response.message);
  return response.data;
}
