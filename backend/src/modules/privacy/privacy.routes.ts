import { Router } from "express";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware.js";
import { requireOnboardingMiddleware } from "../../middlewares/requireOnboarding.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getPrivacySettings, updatePrivacySettings } from "./privacy.controller.js";

export const privacyRouter = Router();

privacyRouter.use(authenticateMiddleware);
privacyRouter.use(requireOnboardingMiddleware);

privacyRouter.get("/", asyncHandler(getPrivacySettings));
privacyRouter.put("/", asyncHandler(updatePrivacySettings));
