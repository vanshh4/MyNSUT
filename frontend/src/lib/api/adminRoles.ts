import { apiEndpoints } from "./endpoints";
import { apiClient } from "./client";
import type { RoleAssignmentPayload, RoleRevocationPayload } from "@mynsut/shared/types/rbac";

export async function listRoles(scopeFilter?: string) {
  const query = scopeFilter ? `?scope=${scopeFilter}` : "";
  return apiClient(`${apiEndpoints.admin.roles.list}${query}`, { method: "GET" }) as Promise<any>;
}

export async function getUserAssignments(userId: string) {
  return apiClient(apiEndpoints.admin.roles.userAssignments(userId), { method: "GET" }) as Promise<any>;
}

export async function assignRole(payload: RoleAssignmentPayload) {
  return apiClient(apiEndpoints.admin.roles.assign, { method: "POST", body: JSON.stringify(payload) }) as Promise<any>;
}

export async function revokeRole(assignmentId: string, payload: RoleRevocationPayload) {
  return apiClient(apiEndpoints.admin.roles.revoke(assignmentId), { method: "POST", body: JSON.stringify(payload) }) as Promise<any>;
}
