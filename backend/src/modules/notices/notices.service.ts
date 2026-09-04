import { noticesRepository } from "./notices.repository.js";
import { CreateNoticeRequest, UpdateNoticeRequest, NoticeFilterQuery } from "./notices.validation.js";
import { NoticeNotFoundError, UntrustedUrlError, NoticeArchivedError } from "./notices.errors.js";
import * as auditService from "../audit/audit.service.js";
import { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma.js";
import { AUDIT_ACTIONS, AUDIT_TARGET_TYPES } from "../../constants/audit.js";
import type { UnifiedFeedFilters, PaginatedUnifiedFeedResponse } from "@mynsut/shared";

const TRUSTED_DOMAINS = process.env.TRUSTED_NOTICE_DOMAINS?.split(",") || ["nsut.ac.in", ".nsut.ac.in"];

const isUrlTrusted = (urlString: string) => {
  try {
    const url = new URL(urlString);
    if (url.protocol !== "https:") return false;
    const hostname = url.hostname;
    return TRUSTED_DOMAINS.some((domain) => {
      if (domain.startsWith(".")) {
        return hostname.endsWith(domain) || hostname === domain.substring(1);
      }
      return hostname === domain;
    });
  } catch {
    return false;
  }
};

export const noticesService = {
  async getUnifiedFeed(userId: string, filters: UnifiedFeedFilters): Promise<PaginatedUnifiedFeedResponse> {
    const student = await prisma.student.findUnique({ where: { userId } });
    const classId = student?.classId || '00000000-0000-0000-0000-000000000000';

    let cursorDate: Date | null = null;
    let cursorId: string | null = null;

    if (filters.cursor) {
      const parts = filters.cursor.split('|');
      if (parts.length === 2 && parts[0] && parts[1]) {
        cursorDate = new Date(parseInt(parts[0], 10));
        cursorId = parts[1];
      }
    }

    const limit = Math.min(filters.limit || 20, 50);

    const typeFilter = filters.type ? Prisma.sql`AND "type" = ${filters.type}` : Prisma.empty;
    const cursorFilter = cursorDate && cursorId
      ? Prisma.sql`AND ("publishedAt" < ${cursorDate}::timestamptz OR ("publishedAt" = ${cursorDate}::timestamptz AND id::uuid < ${cursorId}::uuid))`
      : Prisma.empty;

    const query = Prisma.sql`
      WITH feed AS (
        SELECT 
          id, 
          'OFFICIAL' as "type",
          title, 
          '' as excerpt,
          published_at as "publishedAt",
          source_authority as "sourceName",
          id as "metaId"
        FROM notices
        WHERE status = 'ACTIVE' AND (expires_at IS NULL OR expires_at > NOW())
        
        UNION ALL
        
        SELECT 
          sa.id, 
          'SOCIETY' as "type",
          sa.title, 
          SUBSTRING(sa.content, 1, 150) as excerpt,
          sa.created_at as "publishedAt",
          s.name as "sourceName",
          sa.society_id as "metaId"
        FROM society_announcements sa
        JOIN societies s ON sa.society_id = s.id
        WHERE sa.is_public = true
        
        UNION ALL
        
        SELECT 
          ca.id,
          'CLASS' as "type",
          ca.title,
          SUBSTRING(ca.content, 1, 150) as excerpt,
          ca.created_at as "publishedAt",
          ac.name as "sourceName",
          ca.class_id as "metaId"
        FROM class_announcements ca
        JOIN academic_classes ac ON ca.class_id = ac.id
        WHERE ca.class_id = ${classId}::uuid
        
        UNION ALL
        
        SELECT 
          e.id,
          'EVENT' as "type",
          e.title,
          SUBSTRING(COALESCE(e.description, ''), 1, 150) as excerpt,
          e.created_at as "publishedAt",
          s.name as "sourceName",
          e.society_id as "metaId"
        FROM events e
        JOIN societies s ON e.society_id = s.id
        WHERE e.status = 'PUBLISHED' AND e.end_date > NOW()
      )
      SELECT * FROM feed
      WHERE 1=1
      ${typeFilter}
      ${cursorFilter}
      ORDER BY "publishedAt" DESC, id DESC
      LIMIT ${limit + 1};
    `;

    const results = await prisma.$queryRaw<any[]>(query);
    
    let hasMore = false;
    let nextCursor: string | undefined = undefined;

    if (results.length > limit) {
      hasMore = true;
      results.pop();
    }

    if (results.length > 0) {
      const lastItem = results[results.length - 1];
      const lastDate = new Date(lastItem.publishedAt).getTime();
      nextCursor = `${lastDate}|${lastItem.id}`;
    }

    const response: PaginatedUnifiedFeedResponse = {
      items: results.map(r => ({
        id: r.id,
        type: r.type,
        title: r.title,
        excerpt: r.excerpt,
        publishedAt: new Date(r.publishedAt).toISOString(),
        sourceName: r.sourceName,
        metaId: r.metaId
      })),
      hasMore
    };

    if (nextCursor) {
      response.nextCursor = nextCursor;
    }

    return response;
  },

  async getNotices(filters: NoticeFilterQuery) {
    return noticesRepository.findAll(filters);
  },

  async getNoticeById(id: string) {
    const notice = await noticesRepository.findById(id);
    if (!notice) {
      throw new NoticeNotFoundError();
    }
    return notice;
  },

  async createNotice(creatorId: string, data: CreateNoticeRequest, ipAddress?: string) {
    if (!isUrlTrusted(data.officialUrl)) {
      throw new UntrustedUrlError();
    }

    const cleanData = Object.fromEntries(
      Object.entries({
        ...data,
        creatorId,
        status: data.status || "ACTIVE",
      }).filter(([_, v]) => v !== undefined)
    ) as any;

    const notice = await noticesRepository.create(cleanData);

    await auditService.logAction(
      prisma,
      creatorId,
      AUDIT_ACTIONS.NOTICE_CREATED,
      AUDIT_TARGET_TYPES.NOTICE,
      notice.id,
      undefined,
      { title: notice.title },
      ipAddress
    );

    return notice;
  },

  async updateNotice(id: string, editorId: string, data: UpdateNoticeRequest, ipAddress?: string) {
    const existing = await noticesRepository.findById(id);
    if (!existing) {
      throw new NoticeNotFoundError();
    }

    if (existing.status === "ARCHIVED") {
      throw new NoticeArchivedError();
    }

    if (data.officialUrl && !isUrlTrusted(data.officialUrl)) {
      throw new UntrustedUrlError();
    }

    const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined)) as any;
    const notice = await noticesRepository.update(id, cleanData);

    const action = data.status === "ARCHIVED" ? AUDIT_ACTIONS.NOTICE_ARCHIVED : AUDIT_ACTIONS.NOTICE_UPDATED;

    await auditService.logAction(
      prisma,
      editorId,
      action,
      AUDIT_TARGET_TYPES.NOTICE,
      notice.id,
      undefined,
      { changes: Object.keys(data) },
      ipAddress
    );

    return notice;
  },

  async deleteNotice(id: string, editorId: string, ipAddress?: string) {
    const existing = await noticesRepository.findById(id);
    if (!existing) {
      throw new NoticeNotFoundError();
    }

    await noticesRepository.delete(id);

    await auditService.logAction(
      prisma,
      editorId,
      AUDIT_ACTIONS.NOTICE_DELETED,
      AUDIT_TARGET_TYPES.NOTICE,
      existing.id,
      undefined,
      { title: existing.title },
      ipAddress
    );
  },
};
