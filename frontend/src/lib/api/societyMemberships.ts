import { apiClient } from "./client";
import { apiEndpoints } from "./endpoints";
import type { AddMemberPayload } from "@mynsut/shared";
import type { ApiResponse } from "@mynsut/shared";

export const societyMembershipsApi = {
  getMembers: (societyId: string) => {
    return apiClient<any[]>(apiEndpoints.societies.members(societyId), { method: "GET" });
  },

  addMember: (societyId: string, payload: AddMemberPayload) => {
    return apiClient<any>(apiEndpoints.societies.members(societyId), { method: "POST", body: JSON.stringify(payload) });
  },

  removeMember: (societyId: string, userId: string) => {
    return apiClient<null>(apiEndpoints.societies.removeMember(societyId, userId), { method: "DELETE" });
  }
};
