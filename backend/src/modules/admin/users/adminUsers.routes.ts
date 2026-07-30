import { Router } from "express";
import { authenticate } from "../../auth/auth.middleware.js";
import { requireSuperAdmin } from "../../../middlewares/requireSuperAdmin.middleware.js";
import * as adminUsersController from "./adminUsers.controller.js";

export const adminUsersRouter = Router();

adminUsersRouter.use(authenticate, requireSuperAdmin);

adminUsersRouter.get("/", ...adminUsersController.searchUsers);
adminUsersRouter.get("/:userId", ...adminUsersController.getUserDetail);
