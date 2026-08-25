import { Router } from "express";
import { societyAnnouncementsController } from "./societyAnnouncements.controller.js";
import { authenticateMiddleware as requireAuth } from "../../middlewares/authenticate.middleware.js";

export const societyAnnouncementsRouter = Router({ mergeParams: true });

// requireAuth for fetching announcements so public users can see public ones
societyAnnouncementsRouter.get("/", requireAuth, societyAnnouncementsController.getAnnouncements);
societyAnnouncementsRouter.post("/", requireAuth, societyAnnouncementsController.createAnnouncement);