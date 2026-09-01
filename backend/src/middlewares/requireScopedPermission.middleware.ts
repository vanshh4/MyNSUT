import type { RequestHandler } from "express";
import type { PermissionCode } from "@mynsut/shared/constants/permissions";
import { SCOPES, isScopeCode } from "@mynsut/shared/constants/scopes";
import { ROLES } from "@mynsut/shared/constants/roles";
import { authenticationRequired } from "../modules/auth/auth.errors.js";
import { invalidScope, scopedPermissionDenied } from "../modules/rbac/rbac.errors.js";
import { resolveScopedContext, hasGlobalRole, hasScopedPermission, hasGlobalPermission } from "../modules/rbac/rbac.service.js";

export function requireScopedPermission(permission: PermissionCode): RequestHandler {
  return async (req, res, next) => {
    try {
      if (!req.auth) {
        throw authenticationRequired();
      }

      // Global fallback: SUPER_ADMIN gets a pass on all permissions
      if (hasGlobalRole(req.auth, ROLES.SUPER_ADMIN)) {
        return next();
      }

      // Extract scope based on URL params (convention: classId or societyId)
      let scopeStr: string | undefined;
      let scopeId: string | undefined;

      if (req.params.classId) {
        scopeStr = SCOPES.CLASS;
        scopeId = req.params.classId as string;
      } else if (req.params.societyId) {
        scopeStr = SCOPES.SOCIETY;
        scopeId = req.params.societyId as string;
      } else {
        // No scoped params? Check if they have the permission globally.
        if (hasGlobalPermission(req.auth, permission)) {
           return next();
        }
        throw scopedPermissionDenied();
      }

      if (!isScopeCode(scopeStr)) {
        throw invalidScope(scopeStr || "unknown");
      }

      const scopedContext = await resolveScopedContext(req.auth.user.id, scopeStr, scopeId);

      if (!hasScopedPermission(scopedContext, permission) && !hasGlobalPermission(req.auth, permission)) {
        throw scopedPermissionDenied();
      }

      req.scopedAuth = scopedContext;
      next();
    } catch (error) {
      next(error);
    }
  };
}
