import { prisma } from "../../db/prisma.js";

export const societyPositionsRepository = {
  async getPositions(societyId: string) {
    return prisma.societyPosition.findMany({ where: { societyId } });
  },

  async getPositionById(id: string) {
    return prisma.societyPosition.findUnique({ where: { id } });
  },

  async hasAssignPORPermission(societyId: string, userId: string) {
    const assignment = await prisma.societyPositionAssignment.findFirst({
      where: {
        membership: { societyId, userId },
        position: { canAssignPOR: true }
      },
      include: { position: true }
    });
    return assignment ? assignment.position : null;
  },

  async isDescendant(ancestorId: string, descendantId: string): Promise<boolean> {
    let currentId = descendantId;
    while (currentId) {
      const current = await prisma.societyPosition.findUnique({ where: { id: currentId } });
      if (!current || !current.parentPositionId) return false;
      if (current.parentPositionId === ancestorId) return true;
      currentId = current.parentPositionId;
    }
    return false;
  },

  async createPosition(societyId: string, data: any) {
    return prisma.societyPosition.create({
      data: {
        ...data,
        societyId
      }
    });
  },

  async assignPosition(societyId: string, userId: string, positionId: string) {
    const membership = await prisma.societyMembership.findUnique({
      where: { userId_societyId: { userId, societyId } }
    });
    if (!membership) throw new Error("Membership not found");

    return prisma.societyPositionAssignment.create({
      data: {
        membershipId: membership.id,
        positionId
      }
    });
  },
  
  async revokePosition(societyId: string, userId: string, positionId: string) {
    const membership = await prisma.societyMembership.findUnique({
      where: { userId_societyId: { userId, societyId } }
    });
    if (!membership) throw new Error("Membership not found");

    return prisma.societyPositionAssignment.delete({
      where: {
        membershipId_positionId: {
          membershipId: membership.id,
          positionId
        }
      }
    });
  }
};