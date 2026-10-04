import { apiClient } from "./client";
import type { 
  Resource, 
  ResourceFilters, 
  PaginatedResourceResponse,
  CreateResourcePayload,
  UpdateResourcePayload
} from "@mynsut/shared";

export const resourcesApi = {
  getResources: async (filters: ResourceFilters): Promise<PaginatedResourceResponse> => {
    return apiClient.get<PaginatedResourceResponse>("/resources", { params: filters });
  },

  getResourceById: async (id: string): Promise<Resource> => {
    return apiClient.get<Resource>(`/resources/${id}`);
  },

  createResource: async (data: CreateResourcePayload): Promise<Resource> => {
    return apiClient.post<Resource>("/resources", data);
  },

  updateResource: async (id: string, data: UpdateResourcePayload): Promise<Resource> => {
    return apiClient.patch<Resource>(`/resources/${id}`, data);
  },

  deleteResource: async (id: string): Promise<void> => {
    return apiClient.delete(`/resources/${id}`);
  }
};
