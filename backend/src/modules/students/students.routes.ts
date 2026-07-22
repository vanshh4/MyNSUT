import { Router } from "express";

import { authenticateMiddleware } from "../../middlewares/authenticate.middleware.js";
import { requireOnboardingMiddleware } from "../../middlewares/requireOnboarding.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getMe, onboardStudent } from "./students.controller.js";

export const studentsRouter = Router();

studentsRouter.use(authenticateMiddleware);
studentsRouter.get("/me", requireOnboardingMiddleware, asyncHandler(getMe));
studentsRouter.post("/onboarding", asyncHandler(onboardStudent));
