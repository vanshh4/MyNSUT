import type { PermissionCode } from "@mynsut/shared/constants/permissions";
import type { RoleCode } from "@mynsut/shared/constants/roles";
import type { ScopeCode } from "@mynsut/shared/constants/scopes";

export interface GlobalRoleWithPermissions {
  role: {
    code: string;
    permissions: {
      permission: {
        code: string;
      };
    }[];
  };
}

export interface ClassRoleAssignment {
  id: string;
  classId: string;
  assignedAt: Date;
  role: { code: string };
  revokedAt: Date | null;
}

export interface SocietyRoleAssignment {
  id: string;
  societyId: string;
  assignedAt: Date;
  role: { code: string };
  revokedAt: Date | null;
}

export interface ResolvedScopedContext {
  scope: ScopeCode;
  scopeId: string;
  roles: readonly RoleCode[];
  permissions: readonly PermissionCode[];
}
