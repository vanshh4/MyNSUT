import { societyMembershipsRepository } from "./societyMemberships.repository.js";
import { 
  UserNotFoundError, 
  AlreadyMemberError, 
  UnauthorizedManageMembersError,
  SocietyMembershipNotFoundError 
} from "./societyMemberships.errors.js";
import { logAction } from "../audit/audit.service.js";
import { prisma } from "../../db/prisma.js";

export const societyMembershipsService = {
  async addMember(societyId: string, actorId: string, email: string, ipAddress?: string) {
    // Super Admins bypass society-level permission check. 
    // In a real app, you might check global roles, but here we enforce local POR check.
    const canManage = await societyMembershipsRepository.hasManageMembersPermission(societyId, actorId);
    if (!canManage) {
      throw new UnauthorizedManageMembersError();
    }

    const user = await societyMembershipsRepository.findUserByEmail(email);
    if (!user) {
      throw new UserNotFoundError();
    }

    const existing = await societyMembershipsRepository.getMembership(societyId, user.id);
    if (existing) {
      throw new AlreadyMemberError();
    }

    const membership = await societyMembershipsRepository.addMember(societyId, user.id);
    await logAction(prisma, actorId, "SOCIETY_MEMBER_ADDED", "SOCIETY_MEMBERSHIP", membership.id, user.id, undefined, ipAddress);
    return membership;
  },

  async removeMember(societyId: string, actorId: string, targetUserId: string, ipAddress?: string) {
    const canManage = await societyMembershipsRepository.hasManageMembersPermission(societyId, actorId);
    if (!canManage) {
      throw new UnauthorizedManageMembersError();
    }

    const existing = await societyMembershipsRepository.getMembership(societyId, targetUserId);
    if (!existing) {
      throw new SocietyMembershipNotFoundError();
    }

    await societyMembershipsRepository.removeMember(societyId, targetUserId);
    await logAction(prisma, actorId, "SOCIETY_MEMBER_REMOVED", "SOCIETY_MEMBERSHIP", existing.id, targetUserId, undefined, ipAddress);
  },

  async getMembers(societyId: string, actorId: string) {
    // Only members can view the directory
    const existing = await societyMembershipsRepository.getMembership(societyId, actorId);
    if (!existing) {
      throw new SocietyMembershipNotFoundError("You must be a member to view the directory");
    }
    return societyMembershipsRepository.getMembers(societyId);
  }
};