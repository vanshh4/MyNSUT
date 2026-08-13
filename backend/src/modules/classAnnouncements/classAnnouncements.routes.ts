import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as announcementsController from "./classAnnouncements.controller.js";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware.js";
import { requireScopedPermission } from "../../middlewares/requireScopedPermission.middleware.js";
import { SCOPES } from "@mynsut/shared/constants/scopes";
import { validateBody } from "../../middlewares/validation.middleware.js";
import { createAnnouncementSchema, updateAnnouncementSchema } from "./classAnnouncements.validation.js";

export const classAnnouncementsRoutes = Router({ mergeParams: true });

classAnnouncementsRoutes.use(authenticateMiddleware);

// Get all announcements for a class
classAnnouncementsRoutes.get(
  "/",
  asyncHandler(announcementsController.getAnnouncements)
);

// Create an announcement
// We require the user to have a role in the class (CLASS_CR) that grants permission.
// For Phase 5, any CLASS_CR can create announcements. We can assume a permission like MANAGE_CLASS_ANNOUNCEMENTS.
// Wait, the handover plan says "Ensure actions are scoped strictly to CLASS_CR for the specific class."
// I will check if MANAGE_CLASS_ANNOUNCEMENTS permission exists. For now, I'll use a placeholder or check scoped role.
classAnnouncementsRoutes.post(
  "/",
  requireScopedPermission(SCOPES.CLASS, "classId", "CLASS_ANNOUNCEMENT_CREATE"),
  validateBody(createAnnouncementSchema),
  asyncHandler(announcementsController.createAnnouncement)
);

// Update an announcement
classAnnouncementsRoutes.patch(
  "/:announcementId",
  requireScopedPermission(SCOPES.CLASS, "classId", "CLASS_ANNOUNCEMENT_UPDATE"),
  validateBody(updateAnnouncementSchema),
  asyncHandler(announcementsController.updateAnnouncement)
);

// Delete an announcement
classAnnouncementsRoutes.delete(
  "/:announcementId",
  requireScopedPermission(SCOPES.CLASS, "classId", "CLASS_ANNOUNCEMENT_DELETE"),
  asyncHandler(announcementsController.deleteAnnouncement)
);
