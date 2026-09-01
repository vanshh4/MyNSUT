import type { SafeRoleDefinition, AssignRoleCommand, RevokeRoleCommand } from "./adminRoles.types.js";
import type { UserRolesSummary } from "@mynsut/shared/types/rbac";
import { SCOPES, type ScopeCode } from "@mynsut/shared/constants/scopes";
import { ROLE_DEFINITIONS, ROLES } from "@mynsut/shared/constants/roles";
import { AUDIT_ACTIONS, AUDIT_TARGET_TYPES } from "../../../constants/audit.js";
import { prisma } from "../../../db/prisma.js";
import * as adminRolesRepository from "./adminRoles.repository.js";
import * as rbacRepository from "../../rbac/rbac.repository.js";
import * as auditService from "../../audit/audit.service.js";
import { duplicateRoleAssignment, invalidRoleScopeAssignment, cannotRevokeMandatoryRole, roleAssignmentNotFound } from "../../rbac/rbac.errors.js";
import { ApiError } from "../../../utils/apiError.js";

export async function listRoles(scopeFilter?: ScopeCode): Promise<SafeRoleDefinition[]> {
  const roles = await adminRolesRepository.findAllRolesWithCounts(prisma);
  let mapped = roles.map(r => ({
    code: r.code,
    name: r.name,
    scope: r.scope,
    description: r.description,
    activeAssignmentsCount: r.activeAssignmentsCount
  }));
  if (scopeFilter) {
    mapped = mapped.filter(r => r.scope === scopeFilter);
  }
  return mapped;
}

export async function listUserAssignments(userId: string): Promise<UserRolesSummary> {
  const { global, classRoles, societyRoles } = await adminRolesRepository.findUserAssignments(prisma, userId);
  
  return {
    global: global.map(g => {
      const obj: any = {
        id: `${g.userId}_${g.roleId}`,
        userId: g.userId,
        roleCode: g.role.code,
        scope: SCOPES.GLOBAL,
        assignedAt: g.assignedAt.toISOString(),
      };
      if (g.assignedBy) obj.assignedBy = g.assignedBy;
      return obj;
    }),
    class: classRoles.map(c => {
      const obj: any = {
        id: c.id,
        userId: c.userId,
        roleCode: c.role.code,
        scope: SCOPES.CLASS,
        scopeId: c.classId,
        assignedAt: c.assignedAt.toISOString(),
      };
      if (c.assignedBy) obj.assignedBy = c.assignedBy;
      return obj;
    }),
    society: societyRoles.map(s => {
      const obj: any = {
        id: s.id,
        userId: s.userId,
        roleCode: s.role.code,
        scope: SCOPES.SOCIETY,
        scopeId: s.societyId,
        assignedAt: s.assignedAt.toISOString(),
      };
      if (s.assignedBy) obj.assignedBy = s.assignedBy;
      return obj;
    })
  };
}

export async function assignRole(command: AssignRoleCommand, actorId: string, ipAddress?: string): Promise<void> {
  const roleDef = ROLE_DEFINITIONS[command.roleCode as keyof typeof ROLE_DEFINITIONS];
  if (!roleDef) throw new ApiError(400, "Invalid role code");
  if (roleDef.scope !== command.scope) {
    throw invalidRoleScopeAssignment();
  }
  if (command.scope !== SCOPES.GLOBAL && !command.scopeId) {
    throw new ApiError(400, "scopeId is required for class and society scopes");
  }

  const role = await rbacRepository.findRoleByCode(prisma, command.roleCode);
  if (!role) throw new ApiError(404, "Role not found in DB");

  // Perform assignment in transaction
  await prisma.$transaction(async (tx) => {
    let action: string;
    let targetType: string;

    if (command.scope === SCOPES.GLOBAL) {
      const existing = await adminRolesRepository.findActiveGlobalAssignment(tx, command.userId, role.id);
      if (existing) throw duplicateRoleAssignment();

      await rbacRepository.assignGlobalRole(tx, {
        userId: command.userId,
        roleId: role.id,
        assignedBy: actorId
      });
      action = AUDIT_ACTIONS.GLOBAL_ROLE_ASSIGNED;
      targetType = AUDIT_TARGET_TYPES.ROLE;
    } else if (command.scope === SCOPES.CLASS) {
      const existing = await adminRolesRepository.findActiveClassAssignment(tx, command.userId, role.id, command.scopeId!);
      if (existing) throw duplicateRoleAssignment();

      await rbacRepository.assignClassRole(tx, {
        userId: command.userId,
        roleId: role.id,
        classId: command.scopeId!,
        assignedBy: actorId
      });
      action = AUDIT_ACTIONS.CLASS_ROLE_ASSIGNED;
      targetType = AUDIT_TARGET_TYPES.CLASS_ROLE;
    } else {
      const existing = await adminRolesRepository.findActiveSocietyAssignment(tx, command.userId, role.id, command.scopeId!);
      if (existing) throw duplicateRoleAssignment();

      await rbacRepository.assignSocietyRole(tx, {
        userId: command.userId,
        roleId: role.id,
        societyId: command.scopeId!,
        assignedBy: actorId
      });
      action = AUDIT_ACTIONS.SOCIETY_ROLE_ASSIGNED;
      targetType = AUDIT_TARGET_TYPES.SOCIETY_ROLE;
    }

    await auditService.logAction(
      tx,
      actorId,
      action,
      targetType,
      role.id,
      command.userId,
      { roleCode: command.roleCode, scope: command.scope, scopeId: command.scopeId },
      ipAddress
    );
  });
}

export async function revokeRole(command: RevokeRoleCommand, actorId: string, ipAddress?: string): Promise<void> {
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    let assignment: any;
    let action: string;
    let targetType: string;

    if (command.scope === SCOPES.GLOBAL) {
      const [userId, roleId] = command.assignmentId.split("_");
      assignment = await rbacRepository.findActiveAssignmentById(tx, command.scope, "", userId, roleId);
      if (!assignment) throw roleAssignmentNotFound();
      
      if (assignment.role.code === ROLES.STUDENT) {
        throw cannotRevokeMandatoryRole();
      }

      await rbacRepository.revokeGlobalRole(tx, assignment.userId, assignment.roleId, actorId, now);
      action = AUDIT_ACTIONS.GLOBAL_ROLE_REVOKED;
      targetType = AUDIT_TARGET_TYPES.ROLE;
    } else if (command.scope === SCOPES.CLASS) {
      assignment = await rbacRepository.findActiveAssignmentById(tx, command.scope, command.assignmentId);
      if (!assignment) throw roleAssignmentNotFound();

      await rbacRepository.revokeClassRole(tx, assignment.id, actorId, now);
      action = AUDIT_ACTIONS.CLASS_ROLE_REVOKED;
      targetType = AUDIT_TARGET_TYPES.CLASS_ROLE;
    } else {
      assignment = await rbacRepository.findActiveAssignmentById(tx, command.scope, command.assignmentId);
      if (!assignment) throw roleAssignmentNotFound();

      await rbacRepository.revokeSocietyRole(tx, assignment.id, actorId, now);
      action = AUDIT_ACTIONS.SOCIETY_ROLE_REVOKED;
      targetType = AUDIT_TARGET_TYPES.SOCIETY_ROLE;
    }

    await auditService.logAction(
      tx,
      actorId,
      action,
      targetType,
      assignment.roleId,
      assignment.userId,
      { assignmentId: command.assignmentId, scope: command.scope, roleCode: assignment.role.code },
      ipAddress
    );
  });
}
