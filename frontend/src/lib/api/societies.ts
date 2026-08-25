import { apiClient } from "./client";
import { apiEndpoints } from "./endpoints";
import type { 
  Society, 
  CreateSocietyPayload, 
  UpdateSocietyPayload,
  SocietyPosition,
  AssignPositionPayload,
  CreateAnnouncementPayload,
  SocietyAnnouncement
} from "@mynsut/shared";
import type { PaginatedResponse, ApiResponse } from "@mynsut/shared";

interface SocietyFilters {
  category?: string;
  page?: number;
  limit?: number;
}

export const societiesApi = {
  getSocieties: (filters?: SocietyFilters) => {
    const query = filters ? '?' + new URLSearchParams(filters as any).toString() : '';
    return apiClient<any>(apiEndpoints.societies.list + query, { method: "GET" });
  },

  getSocietyById: (id: string) => {
    return apiClient<Society>(apiEndpoints.societies.detail(id), { method: "GET" });
  },

  createSociety: (payload: CreateSocietyPayload) => {
    return apiClient<Society>(apiEndpoints.societies.create, { method: "POST", body: JSON.stringify(payload) });
  },

  updateSociety: (id: string, payload: UpdateSocietyPayload) => {
    return apiClient<Society>(apiEndpoints.societies.update(id), { method: "PATCH", body: JSON.stringify(payload) });
  },

  // Positions
  getPositions: (societyId: string) => {
    return apiClient<SocietyPosition[]>(apiEndpoints.societies.positions(societyId), { method: "GET" });
  },

  createPosition: (societyId: string, payload: Partial<SocietyPosition>) => {
    return apiClient<SocietyPosition>(apiEndpoints.societies.positions(societyId), { method: "POST", body: JSON.stringify(payload) });
  },

  assignPosition: (societyId: string, payload: AssignPositionPayload) => {
    return apiClient<any>(apiEndpoints.societies.assignPosition(societyId), { method: "POST", body: JSON.stringify(payload) });
  },

  revokePosition: (societyId: string, userId: string, positionId: string) => {
    return apiClient<null>(apiEndpoints.societies.revokePosition(societyId, userId, positionId), { method: "DELETE" });
  },

  // Announcements
  getAnnouncements: (societyId: string) => {
    return apiClient<SocietyAnnouncement[]>(apiEndpoints.societies.announcements(societyId), { method: "GET" });
  },

  createAnnouncement: (societyId: string, payload: CreateAnnouncementPayload) => {
    return apiClient<SocietyAnnouncement>(apiEndpoints.societies.announcements(societyId), { method: "POST", body: JSON.stringify(payload) });
  }
};
