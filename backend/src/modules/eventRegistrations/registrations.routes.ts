import { Router } from "express";
import { registrationsController } from "./registrations.controller.js";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware.js";

const router = Router({ mergeParams: true });

// Mounted at /api/v1/events/:eventId/registrations
router.get("/state", authenticateMiddleware, registrationsController.getState);
router.post("/action", authenticateMiddleware, registrationsController.handleAction);
router.get("/export", authenticateMiddleware, registrationsController.exportRegistrations);

export default router;
