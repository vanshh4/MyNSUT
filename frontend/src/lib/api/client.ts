import { env } from "@/lib/env/env";
import type { ApiResponse } from "@/types";

export class ApiClientError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function apiClient<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init.headers },
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiClientError(response.status, body?.message ?? "Request failed", body);
  }
  return body as ApiResponse<T>;
}
