import { societyAnnouncementsRepository } from "./societyAnnouncements.repository.js";
import { UnauthorizedPostAnnouncementError } from "./societyAnnouncements.errors.js";
import { logAction } from "../audit/audit.service.js";
import { prisma } from "../../db/prisma.js";

export const societyAnnouncementsService = {
  async getAnnouncements(societyId: string, userId?: string) {
    let includePrivate = false;
    if (userId) {
      const membership = await prisma.societyMembership.findUnique({
        where: { userId_societyId: { userId, societyId } }
      });
      if (membership) includePrivate = true;
    }
    return societyAnnouncementsRepository.getAnnouncements(societyId, includePrivate);
  },

  async createAnnouncement(societyId: string, actorId: string, data: any, ipAddress?: string) {
    const canPost = await societyAnnouncementsRepository.hasPostAnnouncementsPermission(societyId, actorId);
    if (!canPost) throw new UnauthorizedPostAnnouncementError();

    const announcement = await societyAnnouncementsRepository.createAnnouncement(societyId, actorId, data);
    await logAction(prisma, actorId, "SOCIETY_ANNOUNCEMENT_CREATED", "SOCIETY_ANNOUNCEMENT", announcement.id, undefined, undefined, ipAddress);
    return announcement;
  }
};