import type { RequestHandler } from "express";
import { ROLES } from "@mynsut/shared/constants/roles";
import { authenticationRequired, insufficientRole } from "../modules/auth/auth.errors.js";

export const requireSuperAdmin: RequestHandler = (req, _res, next) => {
  if (!req.auth) return next(authenticationRequired());
  if (!req.auth.roles.includes(ROLES.SUPER_ADMIN)) return next(insufficientRole());
  next();
};
