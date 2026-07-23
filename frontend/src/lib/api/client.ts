import type { ApiErrorResponse, ApiResponse } from "@mynsut/shared/types/api";

import { env } from "@/lib/env/env";

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return candidate.success === false && typeof candidate.message === "string";
}

function buildUrl(path: string): string {
  const base = env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export async function apiClient<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
  const headers = new Headers(init.headers);
  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Accept", "application/json");

  const response = await fetch(buildUrl(path), {
    ...init,
    credentials: "include",
    headers,
  });

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    if (isApiErrorResponse(body)) {
      throw new ApiClientError(response.status, body.message, body.error.code, body.error.details);
    }
    throw new ApiClientError(response.status, "Request failed.", "UNKNOWN_API_ERROR", body);
  }

  if (!body || typeof body !== "object" || !("success" in body)) {
    throw new ApiClientError(response.status, "The server returned an invalid response.", "INVALID_API_RESPONSE", body);
  }
  return body as ApiResponse<T>;
}
