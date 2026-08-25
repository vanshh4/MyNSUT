import { Router } from "express";
import { societyMembershipsController } from "./societyMemberships.controller.js";
import { authenticateMiddleware as requireAuth } from "../../middlewares/authenticate.middleware.js";

export const societyMembershipsRouter = Router({ mergeParams: true });

societyMembershipsRouter.get("/", requireAuth, societyMembershipsController.getMembers);
societyMembershipsRouter.post("/", requireAuth, societyMembershipsController.addMember);
societyMembershipsRouter.delete("/:userId", requireAuth, societyMembershipsController.removeMember);