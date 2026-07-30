import { Router } from "express";
import { authenticateMiddleware } from "../../../middlewares/authenticate.middleware.js";
import { requireSuperAdmin } from "../../../middlewares/requireSuperAdmin.middleware.js";
import * as adminUsersController from "./adminUsers.controller.js";

export const adminUsersRouter = Router();

adminUsersRouter.use(authenticateMiddleware, requireSuperAdmin);

adminUsersRouter.get("/", ...adminUsersController.searchUsers);
adminUsersRouter.get("/:userId", ...adminUsersController.getUserDetail);
