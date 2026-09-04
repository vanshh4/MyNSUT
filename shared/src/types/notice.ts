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

export type UnifiedFeedType = 'OFFICIAL' | 'SOCIETY' | 'CLASS' | 'EVENT';

export interface UnifiedFeedItem {
  id: string;
  type: UnifiedFeedType;
  title: string;
  excerpt: string;
  publishedAt: string;
  sourceName: string;
  metaId: string;
}

export interface UnifiedFeedFilters {
  type?: UnifiedFeedType;
  limit?: number;
  cursor?: string;
}

export interface PaginatedUnifiedFeedResponse {
  items: UnifiedFeedItem[];
  nextCursor?: string;
  hasMore: boolean;
}
