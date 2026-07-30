import { Router } from "express";
import { authenticate } from "../auth/auth.middleware.js";
import { requireSuperAdmin } from "../../middlewares/requireSuperAdmin.middleware.js";
import * as auditController from "./audit.controller.js";

export const auditRouter = Router();

auditRouter.get("/", authenticate, requireSuperAdmin, ...auditController.listAuditLogs);
auditRouter.get("/:id", authenticate, requireSuperAdmin, ...auditController.getAuditLog);
