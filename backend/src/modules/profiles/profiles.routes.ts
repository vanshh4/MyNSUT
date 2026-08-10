import { Router } from "express";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware.js";
import { requireOnboardingMiddleware } from "../../middlewares/requireOnboarding.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getOwnProfile, getPeerProfile, updateOwnProfile } from "./profiles.controller.js";

export const profilesRouter = Router();

profilesRouter.use(authenticateMiddleware);
profilesRouter.use(requireOnboardingMiddleware);

profilesRouter.get("/me", asyncHandler(getOwnProfile));
profilesRouter.put("/me", asyncHandler(updateOwnProfile));
profilesRouter.get("/:rollNumber", asyncHandler(getPeerProfile));
