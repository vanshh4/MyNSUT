import type { RoleCode } from "@mynsut/shared/constants/roles";
import type { ScopeCode } from "@mynsut/shared/constants/scopes";

export interface AssignRoleCommand {
  userId: string;
  roleCode: RoleCode;
  scope: ScopeCode;
  scopeId?: string;
}

export interface RevokeRoleCommand {
  assignmentId: string;
  scope: ScopeCode;
}

export interface SafeRoleDefinition {
  code: string;
  name: string;
  scope: string;
  description: string | null;
  activeAssignmentsCount: number;
}
