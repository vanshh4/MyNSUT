import type { PermissionCode } from "@mynsut/shared/constants/permissions";
import type { RequestHandler } from "express";

import { authenticationRequired, insufficientPermission } from "../modules/auth/auth.errors.js";

export function requirePermission(...requiredPermissions: PermissionCode[]): RequestHandler {
  return (request, _response, next) => {
    if (!request.auth) {
      next(authenticationRequired());
      return;
    }
    if (!requiredPermissions.every((permission) => request.auth!.permissions.includes(permission))) {
      next(insufficientPermission());
      return;
    }
    next();
  };
}
