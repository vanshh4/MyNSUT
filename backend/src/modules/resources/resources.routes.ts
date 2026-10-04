import { Router } from "express";
import { resourcesController } from "./resources.controller.js";
import { authenticateMiddleware as requireAuth } from "../../middlewares/authenticate.middleware.js";
import { requirePermission } from "../../middlewares/requirePermission.middleware.js";
import { PERMISSIONS } from "@mynsut/shared";

export const resourcesRoutes = Router();

resourcesRoutes.get(
  "/",
  requireAuth,
  requirePermission(PERMISSIONS.RESOURCE_VIEW_PUBLIC),
  resourcesController.getResources
);

resourcesRoutes.get(
  "/:resourceId",
  requireAuth,
  requirePermission(PERMISSIONS.RESOURCE_VIEW_PUBLIC),
  resourcesController.getResourceById
);

resourcesRoutes.post(
  "/",
  requireAuth,
  requirePermission(PERMISSIONS.RESOURCE_CREATE),
  resourcesController.createResource
);

resourcesRoutes.patch(
  "/:resourceId",
  requireAuth,
  requirePermission(PERMISSIONS.RESOURCE_UPDATE),
  resourcesController.updateResource
);

resourcesRoutes.delete(
  "/:resourceId",
  requireAuth,
  requirePermission(PERMISSIONS.RESOURCE_DELETE),
  resourcesController.deleteResource
);
