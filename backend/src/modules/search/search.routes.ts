import { Router } from "express";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware.js";
import { requireOnboardingMiddleware } from "../../middlewares/requireOnboarding.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { searchStudents } from "./search.controller.js";
import { ApiError } from "../../utils/apiError.js";

export const searchRouter = Router();

// Apply domain-level authentication and onboarding checks
searchRouter.use(authenticateMiddleware);
searchRouter.use(requireOnboardingMiddleware);

const searchRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each user to 30 requests per `window`
  keyGenerator: (req, res) => {
    // Primary: Rate limit by authenticated user ID
    if (req.auth?.userId) {
      return req.auth.userId;
    }
    // Fallback: Securely normalize and group IPv6/IPv4 addresses
    return ipKeyGenerator(req as any, res as any);
  },
  handler: (req, res, next) => {
    next(
      new ApiError(429, "Rate limit exceeded for search endpoints. Please try again later.", {
        code: "TOO_MANY_REQUESTS",
      })
    );
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

searchRouter.get("/students", searchRateLimiter, asyncHandler(searchStudents));