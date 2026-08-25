import { Router } from "express";
import { eventsController } from "./events.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = Router();

// Public routes for event discovery
router.get("/", eventsController.getEvents);
router.get("/:eventId", eventsController.getEventById);

// Protected routes for event management
router.post("/", requireAuth, eventsController.createEvent);
router.patch("/:eventId", requireAuth, eventsController.updateEvent);

export default router;
