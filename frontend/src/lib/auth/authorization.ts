import type { AuthenticatedUser } from "@mynsut/shared/types/auth";
import type { RoleCode } from "@mynsut/shared/constants/roles";
import { ROLES } from "@mynsut/shared/constants/roles";
import type { PermissionCode } from "@mynsut/shared/constants/permissions";

export function hasRole(user: AuthenticatedUser, role: RoleCode): boolean {
  return user.roles.includes(role);
}

export function hasPermission(user: AuthenticatedUser, permission: PermissionCode): boolean {
  return user.permissions.includes(permission);
}

export function hasAnyRole(user: AuthenticatedUser, roles: readonly RoleCode[]): boolean {
  return roles.some((role) => user.roles.includes(role));
}

export function hasAllPermissions(user: AuthenticatedUser, permissions: readonly PermissionCode[]): boolean {
  return permissions.every((permission) => user.permissions.includes(permission));
}

export function isSuperAdmin(user: AuthenticatedUser): boolean {
  return hasRole(user, ROLES.SUPER_ADMIN);
}
