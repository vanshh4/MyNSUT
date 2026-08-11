import { apiEndpoints } from "./endpoints";
import { apiClient } from "./client";

export async function searchUsers(params: Record<string, any>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  }
  return apiClient(`${apiEndpoints.admin.users.search}?${query.toString()}`, { method: "GET" }) as Promise<any>;
}

export async function getUserDetail(userId: string) {
  return apiClient(apiEndpoints.admin.users.detail(userId), { method: "GET" }) as Promise<any>;
}
