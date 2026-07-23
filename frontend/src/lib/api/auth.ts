import type { AuthenticatedUser } from "@mynsut/shared/types/auth";

import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { env } from "@/lib/env/env";

function apiUrl(path: string): string {
  return `${env.NEXT_PUBLIC_API_BASE_URL}${path}`;
}

export function beginGoogleSignIn(): void {
  window.location.assign(apiUrl(apiEndpoints.auth.google));
}

export async function getCurrentUser(): Promise<AuthenticatedUser> {
  const response = await apiClient<AuthenticatedUser>(apiEndpoints.auth.me, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

export async function logoutCurrentSession(): Promise<void> {
  const response = await apiClient<null>(apiEndpoints.auth.logout, {
    method: "POST",
  });

  if (!response.success) {
    throw new Error(response.message);
  }
}

export async function logoutEverySession(): Promise<void> {
  const response = await apiClient<null>(apiEndpoints.auth.logoutAll, {
    method: "POST",
  });

  if (!response.success) {
    throw new Error(response.message);
  }
}
