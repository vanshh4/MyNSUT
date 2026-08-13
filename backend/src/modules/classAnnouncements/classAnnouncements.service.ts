import { prisma } from "../../db/prisma.js";
import { classAnnouncementErrors } from "./classAnnouncements.errors.js";
import * as announcementsRepository from "./classAnnouncements.repository.js";
import { logAction } from "../audit/audit.service.js";
import { AUDIT_ACTIONS } from "../../constants/audit.js";
import type { ClassAnnouncementPayload } from "@mynsut/shared/types/class";

export async function getClassAnnouncements(classId: string) {
  return announcementsRepository.findAnnouncementsByClassId(prisma, classId);
}

export async function createAnnouncement(classId: string, authorId: string, data: ClassAnnouncementPayload, actorIp?: string) {
  return prisma.$transaction(async (tx) => {
    const announcement = await announcementsRepository.createAnnouncement(tx, classId, authorId, data);
    
    await logAction(
      tx,
      authorId,
      AUDIT_ACTIONS.CLASS_ANNOUNCEMENT_CREATED,
      "CLASS_ANNOUNCEMENT",
      announcement.id,
      undefined,
      { classId, title: data.title },
      actorIp
    );
    
    return announcement;
  });
}

export async function updateAnnouncement(announcementId: string, authorId: string, data: Partial<ClassAnnouncementPayload>, actorIp?: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await announcementsRepository.findAnnouncementById(tx, announcementId);
    if (!existing) throw classAnnouncementErrors.notFound();
    if (existing.authorId !== authorId) throw classAnnouncementErrors.forbidden();

    const updated = await announcementsRepository.updateAnnouncement(tx, announcementId, data);
    
    await logAction(
      tx,
      authorId,
      AUDIT_ACTIONS.CLASS_ANNOUNCEMENT_UPDATED,
      "CLASS_ANNOUNCEMENT",
      announcementId,
      undefined,
      { classId: existing.classId },
      actorIp
    );
    
    return updated;
  });
}

export async function deleteAnnouncement(announcementId: string, authorId: string, actorIp?: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await announcementsRepository.findAnnouncementById(tx, announcementId);
    if (!existing) throw classAnnouncementErrors.notFound();
    if (existing.authorId !== authorId) throw classAnnouncementErrors.forbidden();

    await announcementsRepository.deleteAnnouncement(tx, announcementId);
    
    await logAction(
      tx,
      authorId,
      AUDIT_ACTIONS.CLASS_ANNOUNCEMENT_DELETED,
      "CLASS_ANNOUNCEMENT",
      announcementId,
      undefined,
      { classId: existing.classId },
      actorIp
    );
  });
}
