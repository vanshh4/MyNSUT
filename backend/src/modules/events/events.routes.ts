import { Router } from "express";
import { eventsController } from "./events.controller.js";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware.js";

const router = Router();

// Public routes for event discovery
router.get("/", eventsController.getEvents);
router.get("/:eventId", eventsController.getEventById);

// Protected routes for event management
router.post("/", authenticateMiddleware, eventsController.createEvent);
router.patch("/:eventId", authenticateMiddleware, eventsController.updateEvent);

export default router;
