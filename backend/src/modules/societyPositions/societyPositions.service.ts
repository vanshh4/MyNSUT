import { societyPositionsRepository } from "./societyPositions.repository.js";
import { UnauthorizedAssignPORError, InvalidHierarchyError, SocietyPositionNotFoundError } from "./societyPositions.errors.js";
import { logAction } from "../audit/audit.service.js";
import { prisma } from "../../db/prisma.js";

export const societyPositionsService = {
  async getPositions(societyId: string) {
    return societyPositionsRepository.getPositions(societyId);
  },

  async createPosition(societyId: string, actorId: string, data: any, ipAddress?: string) {
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

    const position = await societyPositionsRepository.createPosition(societyId, data);
    await logAction(prisma, actorId, "SOCIETY_POSITION_CREATED", "SOCIETY_POSITION", position.id, undefined, undefined, ipAddress);
    return position;
  },

  async assignPosition(societyId: string, actorId: string, data: any, ipAddress?: string) {
    const actorPosition = await societyPositionsRepository.hasAssignPORPermission(societyId, actorId);
    if (!actorPosition) throw new UnauthorizedAssignPORError();

    const isDescendant = await societyPositionsRepository.isDescendant(actorPosition.id, data.positionId);
    if (!isDescendant) throw new InvalidHierarchyError();

    const assignment = await societyPositionsRepository.assignPosition(societyId, data.userId, data.positionId);
    await logAction(prisma, actorId, "SOCIETY_POSITION_ASSIGNED", "SOCIETY_POSITION_ASSIGNMENT", assignment.id, data.userId, undefined, ipAddress);
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