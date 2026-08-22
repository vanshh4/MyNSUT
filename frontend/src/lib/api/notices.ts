import { apiClient } from './client.js';
import { apiEndpoints } from './endpoints.js';
import type { 
  Notice, 
  CreateNoticePayload, 
  UpdateNoticePayload, 
  NoticeFilters, 
  PaginatedNoticeResponse 
} from '@mynsut/shared';

export const noticesApi = {
  getNotices: async (filters?: NoticeFilters): Promise<PaginatedNoticeResponse> => {
    return apiClient.get<PaginatedNoticeResponse>(apiEndpoints.notices.list, { params: filters });
  },

  getNoticeById: async (id: string): Promise<Notice> => {
    return apiClient.get<Notice>(apiEndpoints.notices.detail(id));
  },

  createNotice: async (data: CreateNoticePayload): Promise<Notice> => {
    return apiClient.post<Notice>(apiEndpoints.notices.create, data);
  },

  updateNotice: async (id: string, data: UpdateNoticePayload): Promise<Notice> => {
    return apiClient.patch<Notice>(apiEndpoints.notices.update(id), data);
  },

  deleteNotice: async (id: string): Promise<void> => {
    return apiClient.delete(apiEndpoints.notices.delete(id));
  },
};
