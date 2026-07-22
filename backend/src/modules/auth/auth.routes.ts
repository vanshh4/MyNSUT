import { Router } from "express";

import { authenticateMiddleware } from "../../middlewares/authenticate.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  getCurrentUser,
  handleGoogleCallback,
  logout,
  logoutAllDevices,
  refreshSession,
  startGoogleLogin,
} from "./auth.controller.js";

export const authRouter = Router();

authRouter.get("/google", startGoogleLogin);
authRouter.get("/google/callback", asyncHandler(handleGoogleCallback));
authRouter.get("/me", authenticateMiddleware, getCurrentUser);
authRouter.post("/session/refresh", authenticateMiddleware, asyncHandler(refreshSession));
authRouter.post("/logout", authenticateMiddleware, asyncHandler(logout));
authRouter.post("/logout-all", authenticateMiddleware, asyncHandler(logoutAllDevices));
