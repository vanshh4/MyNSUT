import type { AuthContext, SafeAuthenticatedUser } from "../modules/auth/auth.types.js";

import type { PermissionCode } from "@mynsut/shared/constants/permissions";
import type { RoleCode } from "@mynsut/shared/constants/roles";
import type { ScopeCode } from "@mynsut/shared/constants/scopes";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext & { user: SafeAuthenticatedUser };
      scopedAuth?: {
        scope: ScopeCode;
        scopeId: string;
        roles: readonly RoleCode[];
        permissions: readonly PermissionCode[];
      };
      params: Record<string, string>;
    }
  }
}
export {};
