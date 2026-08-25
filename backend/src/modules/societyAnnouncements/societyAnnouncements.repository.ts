import { prisma } from "../../db/prisma.js";

export const societyAnnouncementsRepository = {
  async hasPostAnnouncementsPermission(societyId: string, userId: string) {
    const assignment = await prisma.societyPositionAssignment.findFirst({
      where: {
        membership: { societyId, userId },
        position: { canPostAnnouncements: true }
      }
    });
    return !!assignment;
  },

  async getAnnouncements(societyId: string, includePrivate: boolean) {
    return prisma.societyAnnouncement.findMany({
      where: {
        societyId,
        ...(includePrivate ? {} : { isPublic: true })
      },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, fullName: true, profileImageUrl: true } } }
    });
  },

  async createAnnouncement(societyId: string, authorId: string, data: any) {
    return prisma.societyAnnouncement.create({
      data: {
        ...data,
        societyId,
        authorId
      }
    });
  }
};