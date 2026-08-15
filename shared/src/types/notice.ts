import type { NoticeCategory, NoticeStatus } from '../constants/notices.js';
import type { PaginatedResponse } from './api.js';

export interface Notice {
  id: string;
  creatorId: string;
  title: string;
  category: NoticeCategory;
  sourceAuthority: string;
  officialUrl: string;
  publishedAt: string;
  expiresAt: string | null;
  status: NoticeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoticePayload {
  title: string;
  category: NoticeCategory;
  sourceAuthority: string;
  officialUrl: string;
  publishedAt: string;
  expiresAt?: string | null;
  status?: NoticeStatus;
}

export interface UpdateNoticePayload {
  title?: string;
  category?: NoticeCategory;
  sourceAuthority?: string;
  officialUrl?: string;
  publishedAt?: string;
  expiresAt?: string | null;
  status?: NoticeStatus;
}

export interface NoticeFilters {
  category?: NoticeCategory;
  status?: NoticeStatus;
  search?: string;
}

export type PaginatedNoticeResponse = PaginatedResponse<Notice>;
