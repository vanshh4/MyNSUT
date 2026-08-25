import { prisma } from "../../db/prisma.js";

export const societyMembershipsRepository = {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async getMembership(societyId: string, userId: string) {
    return prisma.societyMembership.findUnique({
      where: {
        userId_societyId: { userId, societyId }
      }
    });
  },

  async hasManageMembersPermission(societyId: string, userId: string) {
    // Check if the user has a SocietyPositionAssignment with canManageMembers = true for this society
    const assignment = await prisma.societyPositionAssignment.findFirst({
      where: {
        membership: { societyId, userId },
        position: { canManageMembers: true }
      }
    });
    return !!assignment;
  },

  async addMember(societyId: string, userId: string) {
    return prisma.societyMembership.create({
      data: { societyId, userId }
    });
  },

  async removeMember(societyId: string, userId: string) {
    return prisma.societyMembership.delete({
      where: { userId_societyId: { userId, societyId } }
    });
  },

  async getMembers(societyId: string) {
    return prisma.societyMembership.findMany({
      where: { societyId },
      include: {
        user: { select: { id: true, fullName: true, email: true, profileImageUrl: true } },
        positions: { include: { position: true } }
      }
    });
  }
};