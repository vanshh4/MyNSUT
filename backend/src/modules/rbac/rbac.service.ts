import { isPermissionCode, type PermissionCode } from "@mynsut/shared/constants/permissions";
import { isRoleCode, type RoleCode } from "@mynsut/shared/constants/roles";
import { SCOPES, type ScopeCode } from "@mynsut/shared/constants/scopes";
import type { AuthContext } from "../auth/auth.types.js";
import { prisma } from "../../db/prisma.js";
import * as rbacRepository from "./rbac.repository.js";
import type { ResolvedScopedContext } from "./rbac.types.js";

export async function resolveGlobalPermissions(userId: string) {
  const assignments = await rbacRepository.findActiveGlobalRoles(prisma, userId);
  const roles = [...new Set(assignments.map(a => a.role.code).filter(isRoleCode))];
  const permissions = [
    ...new Set(
      assignments
        .flatMap(a => a.role.permissions.map(p => p.permission.code))
        .filter(isPermissionCode)
    ),
  ];
  return { roles, permissions };
}

export async function resolveScopedContext(
  userId: string,
  scope: ScopeCode,
  scopeId: string
): Promise<ResolvedScopedContext> {
  let roles: RoleCode[] = [];
  let permissions: PermissionCode[] = [];

  if (scope === SCOPES.CLASS) {
    const assignments = await rbacRepository.findActiveClassRoles(prisma, userId, scopeId);
    roles = [...new Set(assignments.map(a => a.role.code).filter(isRoleCode))];
    permissions = [
      ...new Set(
        assignments
          .flatMap(a => a.role.permissions.map(p => p.permission.code))
          .filter(isPermissionCode)
      ),
    ];
  } else if (scope === SCOPES.SOCIETY) {
    const assignments = await rbacRepository.findActiveSocietyRoles(prisma, userId, scopeId);
    roles = [...new Set(assignments.map(a => a.role.code).filter(isRoleCode))];
    permissions = [
      ...new Set(
        assignments
          .flatMap(a => a.role.permissions.map(p => p.permission.code))
          .filter(isPermissionCode)
      ),
    ];
  }

  return { scope, scopeId, roles, permissions };
}

export function hasGlobalRole(authContext: AuthContext, role: RoleCode): boolean {
  return authContext.roles.includes(role);
}

export function hasGlobalPermission(authContext: AuthContext, permission: PermissionCode): boolean {
  return authContext.permissions.includes(permission);
}

export function hasScopedPermission(
  scopedContext: ResolvedScopedContext,
  permission: PermissionCode
): boolean {
  return scopedContext.permissions.includes(permission);
}
