import { Router } from "express";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware.js";
import { requireSuperAdmin } from "../../middlewares/requireSuperAdmin.middleware.js";
import * as auditController from "./audit.controller.js";

export const auditRouter = Router();

auditRouter.get("/", authenticateMiddleware, requireSuperAdmin, ...auditController.listAuditLogs);
auditRouter.get("/:id", authenticateMiddleware, requireSuperAdmin, ...auditController.getAuditLog);
