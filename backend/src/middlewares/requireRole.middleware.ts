import type { RoleCode } from "@mynsut/shared/constants/roles";
import type { RequestHandler } from "express";

import { authenticationRequired, insufficientRole } from "../modules/auth/auth.errors.js";

export function requireRole(...requiredRoles: RoleCode[]): RequestHandler {
  return (request, _response, next) => {
    if (!request.auth) {
      next(authenticationRequired());
      return;
    }
    if (!requiredRoles.some((role) => request.auth!.roles.includes(role))) {
      next(insufficientRole());
      return;
    }
    next();
  };
}
