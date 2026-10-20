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
    const params = new URLSearchParams();
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());
    if (filters.query) params.set("query", filters.query);
    if (filters.resourceType) params.set("resourceType", filters.resourceType);
    if (filters.subjectCode) params.set("subjectCode", filters.subjectCode);
    if (filters.department) params.set("department", filters.department);
    if (filters.semester) params.set("semester", filters.semester.toString());
    if (filters.academicYear) params.set("academicYear", filters.academicYear.toString());
    if (filters.examSession) params.set("examSession", filters.examSession);
    if (filters.status) params.set("status", filters.status);

    const queryString = params.toString();
    const url = queryString ? `/resources?${queryString}` : `/resources`;
    const response = await apiClient<PaginatedResourceResponse>(url, { method: "GET" });
    return (response as any).data;
  },

  getResourceById: async (id: string): Promise<Resource> => {
    const response = await apiClient<Resource>(`/resources/${id}`, { method: "GET" });
    return (response as any).data;
  },

  createResource: async (data: CreateResourcePayload): Promise<Resource> => {
    const response = await apiClient<Resource>("/resources", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return (response as any).data;
  },

  updateResource: async (id: string, data: UpdateResourcePayload): Promise<Resource> => {
    const response = await apiClient<Resource>(`/resources/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return (response as any).data;
  },

  deleteResource: async (id: string): Promise<void> => {
    await apiClient(`/resources/${id}`, { method: "DELETE" });
  }
};
