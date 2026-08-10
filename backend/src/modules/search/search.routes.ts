import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware.js";
import { requireOnboardingMiddleware } from "../../middlewares/requireOnboarding.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { searchStudents } from "./search.controller.js";
import { ApiError } from "../../utils/apiError.js";

export const searchRouter = Router();

searchRouter.use(authenticateMiddleware);
searchRouter.use(requireOnboardingMiddleware);

const searchRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each user to 30 requests per `window`
  keyGenerator: (req) => req.auth?.userId || req.ip || "unknown", // Rate limit primarily by user ID
  handler: (req, res, next) => {
    next(new ApiError(429, "Rate limit exceeded for search endpoints. Please try again later.", { code: "TOO_MANY_REQUESTS" }));
  },
  standardHeaders: true,
  legacyHeaders: false,
});

searchRouter.get("/students", searchRateLimiter, asyncHandler(searchStudents));
