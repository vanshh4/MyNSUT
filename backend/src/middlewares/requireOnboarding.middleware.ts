import type { RequestHandler } from "express";

import { authenticationRequired, onboardingRequired } from "../modules/auth/auth.errors.js";

export const requireOnboardingMiddleware: RequestHandler = (request, _response, next) => {
  if (!request.auth) {
    next(authenticationRequired());
    return;
  }
  if (!request.auth.onboardingCompleted) {
    next(onboardingRequired());
    return;
  }
  next();
};
