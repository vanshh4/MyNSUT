import type { PermissionCode } from "@mynsut/shared/constants/permissions";
import type { RequestHandler } from "express";

import { authenticationRequired, insufficientPermission } from "../modules/auth/auth.errors.js";

/**
 * Ensures the user has all of the required global permissions.
 * Note: `request.auth.permissions` is populated at session resolution and automatically
 * excludes permissions from any roles where `revokedAt` is set.
 */
export function requirePermission(...requiredPermissions: PermissionCode[]): RequestHandler {
  return (request, _response, next) => {
    if (!request.auth) {
      next(authenticationRequired());
      return;
    }
    if (
      !requiredPermissions.every((permission) => request.auth!.permissions.includes(permission))
    ) {
      next(insufficientPermission());
      return;
    }
    next();
  };
}
