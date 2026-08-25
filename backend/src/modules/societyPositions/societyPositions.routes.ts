import { Router } from "express";
import { societyPositionsController } from "./societyPositions.controller.js";
import { authenticateMiddleware as requireAuth } from "../../middlewares/authenticate.middleware.js";

export const societyPositionsRouter = Router({ mergeParams: true });

societyPositionsRouter.get("/", requireAuth, societyPositionsController.getPositions);
societyPositionsRouter.post("/", requireAuth, societyPositionsController.createPosition);
societyPositionsRouter.post("/assign", requireAuth, societyPositionsController.assignPosition);
societyPositionsRouter.delete("/revoke/:userId/:positionId", requireAuth, societyPositionsController.revokePosition);