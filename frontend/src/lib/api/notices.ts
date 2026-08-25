import { apiClient } from './client';
import { apiEndpoints } from './endpoints';
import type { 
  Notice, 
  CreateNoticePayload, 
  UpdateNoticePayload, 
  NoticeFilters, 
  PaginatedNoticeResponse 
} from '@mynsut/shared';

export const noticesApi = {
  getNotices: async (filters?: NoticeFilters & { page?: number }): Promise<PaginatedNoticeResponse> => {
    const params = new URLSearchParams();
    if (filters?.category) params.set('category', filters.category);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.page) params.set('page', filters.page.toString());
    
    const queryString = params.toString();
    const url = queryString ? `${apiEndpoints.notices.list}?${queryString}` : apiEndpoints.notices.list;

    const response = await apiClient<Notice[]>(url, { method: "GET" });
    return {
      success: true,
      message: "Success",
      data: (response as any).data || [],
      meta: (response as any).meta || undefined,
    } as any;
  },

  getNoticeById: async (id: string): Promise<Notice> => {
    const response = await apiClient<Notice>(apiEndpoints.notices.detail(id), { method: "GET" });
    return (response as any).data as Notice;
  },

  createNotice: async (data: CreateNoticePayload): Promise<Notice> => {
    const response = await apiClient<Notice>(apiEndpoints.notices.create, { 
      method: "POST",
      body: JSON.stringify(data)
    });
    return (response as any).data as Notice;
  },

  updateNotice: async (id: string, data: UpdateNoticePayload): Promise<Notice> => {
    const response = await apiClient<Notice>(apiEndpoints.notices.update(id), { 
      method: "PATCH",
      body: JSON.stringify(data)
    });
    return (response as any).data as Notice;
  },

  deleteNotice: async (id: string): Promise<void> => {
    await apiClient<null>(apiEndpoints.notices.delete(id), { method: "DELETE" });
  },
};
