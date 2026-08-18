import { noticesRepository } from "./notices.repository.js";
import { CreateNoticeRequest, UpdateNoticeRequest, NoticeFilterQuery } from "./notices.validation.js";
import { NoticeNotFoundError, UntrustedUrlError, NoticeArchivedError } from "./notices.errors.js";
import { auditService } from "../audit/audit.service.js";
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

    const notice = await noticesRepository.create({
      ...data,
      creatorId,
      status: data.status || "ACTIVE",
    });

    await auditService.log({
      actorId: creatorId,
      action: AUDIT_ACTIONS.NOTICE_CREATED,
      targetType: AUDIT_TARGET_TYPES.NOTICE,
      targetId: notice.id,
      ipAddress,
      metadata: { title: notice.title },
    });

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

    const notice = await noticesRepository.update(id, data);

    const action = data.status === "ARCHIVED" ? AUDIT_ACTIONS.NOTICE_ARCHIVED : AUDIT_ACTIONS.NOTICE_UPDATED;

    await auditService.log({
      actorId: editorId,
      action,
      targetType: AUDIT_TARGET_TYPES.NOTICE,
      targetId: notice.id,
      ipAddress,
      metadata: { changes: Object.keys(data) },
    });

    return notice;
  },

  async deleteNotice(id: string, editorId: string, ipAddress?: string) {
    const existing = await noticesRepository.findById(id);
    if (!existing) {
      throw new NoticeNotFoundError();
    }

    await noticesRepository.delete(id);

    await auditService.log({
      actorId: editorId,
      action: AUDIT_ACTIONS.NOTICE_DELETED,
      targetType: AUDIT_TARGET_TYPES.NOTICE,
      targetId: existing.id,
      ipAddress,
      metadata: { title: existing.title },
    });
  },
};
