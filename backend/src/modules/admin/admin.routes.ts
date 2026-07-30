import { Router } from "express";
import { adminRolesRouter } from "./roles/adminRoles.routes.js";
import { adminUsersRouter } from "./users/adminUsers.routes.js";

export const adminRouter = Router();
adminRouter.use("/roles", adminRolesRouter);
adminRouter.use("/users", adminUsersRouter);
