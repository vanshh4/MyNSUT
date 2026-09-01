import { noticesRepository } from "./notices.repository.js";
import { CreateNoticeRequest, UpdateNoticeRequest, NoticeFilterQuery } from "./notices.validation.js";
import { NoticeNotFoundError, UntrustedUrlError, NoticeArchivedError } from "./notices.errors.js";
import * as auditService from "../audit/audit.service.js";
import { prisma } from "../../db/prisma.js";
import { AUDIT_ACTIONS, AUDIT_TARGET_TYPES } from "../../constants/audit.js";

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
