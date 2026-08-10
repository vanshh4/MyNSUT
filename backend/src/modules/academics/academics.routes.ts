import { Router } from "express";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware.js";
import { requireOnboardingMiddleware } from "../../middlewares/requireOnboarding.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getAcademicSummary, getSemesterResult } from "./academics.controller.js";

export const academicsRouter = Router();

academicsRouter.use(authenticateMiddleware);
academicsRouter.use(requireOnboardingMiddleware);

academicsRouter.get("/summary/:rollNumber", asyncHandler(getAcademicSummary));
academicsRouter.get("/semester/:rollNumber/:semester", asyncHandler(getSemesterResult));
