import { apiEndpoints } from "./endpoints";
import { apiClient } from "./client";

export async function listAuditLogs(filters: Record<string, any>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  }
  return apiClient.get(`${apiEndpoints.admin.auditLogs.list}?${query.toString()}`);
}

export async function getAuditLog(id: string) {
  return apiClient.get(apiEndpoints.admin.auditLogs.detail(id));
}
