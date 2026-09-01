import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as classesController from "./classes.controller.js";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware.js";
import { requireRole } from "../../middlewares/requireRole.middleware.js";
import { ROLES } from "@mynsut/shared/constants/roles";
import { validateBody, validateParams } from "../../middlewares/validation.middleware.js";
import { assignCrSchema, revokeCrSchema } from "./classes.validation.js";

export const classesRoutes = Router();

classesRoutes.use(authenticateMiddleware);

// Get class details
classesRoutes.get(
  "/:classId",
  asyncHandler(classesController.getClassDetails)
);

// Get class members
classesRoutes.get(
  "/:classId/members",
  asyncHandler(classesController.getClassMembers)
);

// Assign a Class Representative
classesRoutes.post(
  "/:classId/cr",
  requireRole(ROLES.SUPER_ADMIN),
  validateBody(assignCrSchema),
  asyncHandler(classesController.assignClassCr)
);

// Revoke a Class Representative role
classesRoutes.delete(
  "/:classId/cr/:studentId",
  requireRole(ROLES.SUPER_ADMIN),
  validateParams(revokeCrSchema),
  asyncHandler(classesController.revokeClassCr)
);

// List classes
classesRoutes.get(
  "/",
  asyncHandler(classesController.listClasses)
);
