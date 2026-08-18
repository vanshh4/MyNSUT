import { z } from "zod";
import { NOTICE_CATEGORY, NOTICE_STATUS } from "@mynsut/shared";

export const createNoticeSchema = z.object({
  title: z.string().min(3).max(255),
  category: z.nativeEnum(NOTICE_CATEGORY),
  sourceAuthority: z.string().min(2).max(255),
  officialUrl: z.string().url(),
  publishedAt: z.string().datetime(),
  expiresAt: z.string().datetime().nullable().optional(),
  status: z.nativeEnum(NOTICE_STATUS).optional(),
});

export const updateNoticeSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  category: z.nativeEnum(NOTICE_CATEGORY).optional(),
  sourceAuthority: z.string().min(2).max(255).optional(),
  officialUrl: z.string().url().optional(),
  publishedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  status: z.nativeEnum(NOTICE_STATUS).optional(),
});

export const noticeFilterSchema = z.object({
  category: z.nativeEnum(NOTICE_CATEGORY).optional(),
  status: z.nativeEnum(NOTICE_STATUS).optional(),
  search: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export type CreateNoticeRequest = z.infer<typeof createNoticeSchema>;
export type UpdateNoticeRequest = z.infer<typeof updateNoticeSchema>;
export type NoticeFilterQuery = z.infer<typeof noticeFilterSchema>;
