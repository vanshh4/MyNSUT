import { Router } from "express";
import { societiesController } from "./societies.controller.js";
import { authenticateMiddleware as requireAuth } from "../../middlewares/authenticate.middleware.js";
import { requirePermission } from "../../middlewares/requirePermission.middleware.js";
import { PERMISSIONS } from "@mynsut/shared";

export const societiesRouter = Router();

societiesRouter.get("/", requireAuth, societiesController.getSocieties);
societiesRouter.get("/:societyId", requireAuth, societiesController.getSocietyById);

societiesRouter.post("/", requireAuth, requirePermission("SOCIETY_CREATE"), societiesController.createSociety);
societiesRouter.patch("/:societyId", requireAuth, requirePermission("SOCIETY_UPDATE_PROFILE"), societiesController.updateSociety);
societiesRouter.delete("/:societyId", requireAuth, requirePermission("SOCIETY_CREATE"), societiesController.deleteSociety);