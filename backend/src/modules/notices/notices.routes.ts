import { Router } from "express";
import { noticesController } from "./notices.controller.js";
import { authenticateMiddleware as requireAuth } from "../../middlewares/authenticate.middleware.js";
import { requirePermission } from "../../middlewares/requirePermission.middleware.js";
import { PERMISSIONS } from "@mynsut/shared";

export const noticesRoutes = Router();

noticesRoutes.get("/", requireAuth, noticesController.getNotices);
noticesRoutes.get("/:noticeId", requireAuth, noticesController.getNoticeById);

noticesRoutes.post(
  "/",
  requireAuth,
  requirePermission(PERMISSIONS.NOTICE_CREATE_OFFICIAL),
  noticesController.createNotice
);
noticesRoutes.patch(
  "/:noticeId",
  requireAuth,
  requirePermission(PERMISSIONS.NOTICE_CREATE_OFFICIAL),
  noticesController.updateNotice
);
noticesRoutes.delete(
  "/:noticeId",
  requireAuth,
  requirePermission(PERMISSIONS.NOTICE_DELETE),
  noticesController.deleteNotice
);
