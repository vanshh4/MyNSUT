import { apiEndpoints } from "./endpoints";
import { apiClient } from "./client";
import type { RoleAssignmentPayload, RoleRevocationPayload } from "@mynsut/shared/types/rbac";

export async function listRoles(scopeFilter?: string) {
  const query = scopeFilter ? `?scope=${scopeFilter}` : "";
  return apiClient.get(`${apiEndpoints.admin.roles.list}${query}`);
}

export async function getUserAssignments(userId: string) {
  return apiClient.get(apiEndpoints.admin.roles.userAssignments(userId));
}

export async function assignRole(payload: RoleAssignmentPayload) {
  return apiClient.post(apiEndpoints.admin.roles.assign, payload);
}

export async function revokeRole(assignmentId: string, payload: RoleRevocationPayload) {
  return apiClient.post(apiEndpoints.admin.roles.revoke(assignmentId), payload);
}
