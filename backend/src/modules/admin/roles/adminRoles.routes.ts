import { Router } from "express";
import { authenticateMiddleware } from "../../../middlewares/authenticate.middleware.js";
import { requireSuperAdmin } from "../../../middlewares/requireSuperAdmin.middleware.js";
import * as adminRolesController from "./adminRoles.controller.js";

export const adminRolesRouter = Router();

adminRolesRouter.use(authenticateMiddleware, requireSuperAdmin);

adminRolesRouter.get("/", ...adminRolesController.listRoles);
adminRolesRouter.get("/users/:userId", ...adminRolesController.listUserAssignments);
adminRolesRouter.post("/assign", ...adminRolesController.assignRole);
adminRolesRouter.post("/revoke/:assignmentId", ...adminRolesController.revokeRole);
