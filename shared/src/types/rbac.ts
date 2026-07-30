import type { PermissionCode } from "../constants/permissions.js";
import type { RoleCode } from "../constants/roles.js";
import type { ScopeCode } from "../constants/scopes.js";

export interface ScopedRoleAssignment {
  scope: ScopeCode;
  scopeId: string;
  roleCode: RoleCode;
  assignedAt: string;
}

export interface AuthorizationSummary {
  globalRoles: readonly RoleCode[];
  globalPermissions: readonly PermissionCode[];
  classRoles: readonly ScopedRoleAssignment[];
  societyRoles: readonly ScopedRoleAssignment[];
}

export interface RoleAssignmentPayload {
  userId: string;
  roleCode: RoleCode;
  scope: ScopeCode;
  scopeId?: string;
}

export interface RoleRevocationPayload {
  scope: ScopeCode;
}

export interface RoleAssignmentResponse {
  assignment: SafeRoleAssignment;
}

export interface SafeRoleAssignment {
  id: string;
  userId: string;
  roleCode: RoleCode;
  scope: ScopeCode;
  scopeId?: string;
  assignedAt: string;
  assignedBy?: string;
}

export interface UserRolesSummary {
  global: readonly SafeRoleAssignment[];
  class: readonly SafeRoleAssignment[];
  society: readonly SafeRoleAssignment[];
}
