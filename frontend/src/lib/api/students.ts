import type {
  OnboardingRequest,
  OnboardingResponse,
  StudentProfile,
} from "@mynsut/shared/types/student";

import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export async function submitOnboarding(
  input: OnboardingRequest
): Promise<OnboardingResponse> {
  const response = await apiClient<OnboardingResponse>(apiEndpoints.onboarding, {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

export async function getCurrentStudent(): Promise<StudentProfile> {
  const response = await apiClient<StudentProfile>(apiEndpoints.profile.me, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}
