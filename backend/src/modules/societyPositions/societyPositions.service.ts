import { societyPositionsRepository } from "./societyPositions.repository.js";
import { UnauthorizedAssignPORError, InvalidHierarchyError, SocietyPositionNotFoundError } from "./societyPositions.errors.js";
import { logAction } from "../audit/audit.service.js";
import { prisma } from "../../db/prisma.js";

export const societyPositionsService = {
  async getPositions(societyId: string) {
    return societyPositionsRepository.getPositions(societyId);
  },

  async createPosition(societyId: string, actorId: string, data: any, ipAddress?: string, isAdmin: boolean = false) {
    if (!isAdmin) {
      const actorPosition = await societyPositionsRepository.hasAssignPORPermission(societyId, actorId);
      if (!actorPosition) throw new UnauthorizedAssignPORError();

      if (data.parentPositionId) {
        if (data.parentPositionId !== actorPosition.id) {
          const isDescendant = await societyPositionsRepository.isDescendant(actorPosition.id, data.parentPositionId);
          if (!isDescendant) throw new InvalidHierarchyError();
        }
      } else {
        // Must have a parent in hierarchy if created by a member
        throw new InvalidHierarchyError("Created positions must fall under your hierarchy");
      }
    }

    const position = await societyPositionsRepository.createPosition(societyId, data);
    await logAction(prisma, actorId, "SOCIETY_POSITION_CREATED", "SOCIETY_POSITION", position.id, undefined, undefined, ipAddress);
    return position;
  },

  async assignPosition(societyId: string, actorId: string, data: any, ipAddress?: string, isAdmin: boolean = false) {
    if (!isAdmin) {
      const actorPosition = await societyPositionsRepository.hasAssignPORPermission(societyId, actorId);
      if (!actorPosition) throw new UnauthorizedAssignPORError();

      const isDescendant = await societyPositionsRepository.isDescendant(actorPosition.id, data.positionId);
      if (!isDescendant) throw new InvalidHierarchyError();
    }

    let finalUserId = data.userId;
    // If it's not a UUID, treat it as a roll number
    if (!finalUserId.includes("-")) {
      const student = await prisma.student.findFirst({
        where: {
          OR: [
            { rollNumber: finalUserId },
            { umsRollNumber: finalUserId }
          ]
        }
      });
      if (!student) throw new Error("Could not find student with that Roll Number");
      finalUserId = student.userId;
    }

    // Ensure user is a member of the society before assigning. If not, create membership automatically (especially useful for initial president)
    let membership = await prisma.societyMembership.findUnique({
      where: { userId_societyId: { userId: finalUserId, societyId } }
    });
    if (!membership) {
      membership = await prisma.societyMembership.create({
        data: { userId: finalUserId, societyId }
      });
    }

    const assignment = await societyPositionsRepository.assignPosition(societyId, finalUserId, data.positionId);
    await logAction(prisma, actorId, "SOCIETY_POSITION_ASSIGNED", "SOCIETY_POSITION_ASSIGNMENT", assignment.id, finalUserId, undefined, ipAddress);
    return assignment;
  },

  async revokePosition(societyId: string, actorId: string, userId: string, positionId: string, ipAddress?: string) {
    const actorPosition = await societyPositionsRepository.hasAssignPORPermission(societyId, actorId);
    if (!actorPosition) throw new UnauthorizedAssignPORError();

    const isDescendant = await societyPositionsRepository.isDescendant(actorPosition.id, positionId);
    if (!isDescendant) throw new InvalidHierarchyError();

    await societyPositionsRepository.revokePosition(societyId, userId, positionId);
    await logAction(prisma, actorId, "SOCIETY_POSITION_REVOKED", "SOCIETY_POSITION", positionId, userId, undefined, ipAddress);
  }
};