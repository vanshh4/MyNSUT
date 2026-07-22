import type { Request, RequestHandler } from "express";

import { authConfig } from "../config/auth.js";
import { resolveSession } from "../modules/auth/session.service.js";

function readCookie(request: Request, name: string): string | undefined {
  const cookies: unknown = request.cookies;

  if (!cookies || typeof cookies !== "object") {
    return undefined;
  }

  const value = (cookies as Record<string, unknown>)[name];

  return typeof value === "string" ? value : undefined;
}

export const optionalAuthMiddleware: RequestHandler = async (request, response, next) => {
  const rawToken = readCookie(request, authConfig.session.cookieName);

  if (!rawToken) {
    next();
    return;
  }

  try {
    const resolved = await resolveSession(rawToken);

    if (resolved.renewed) {
      response.cookie(authConfig.session.cookieName, rawToken, {
        ...authConfig.cookies.session,
        expires: resolved.expiresAt,
      });
    }

    request.auth = {
      userId: resolved.user.id,
      sessionId: resolved.sessionId,
      email: resolved.user.email,
      onboardingCompleted: resolved.user.onboardingCompleted,
      roles: resolved.user.roles,
      permissions: resolved.user.permissions,
      studentId: resolved.user.student?.id ?? null,
      classId: resolved.user.student?.classId ?? null,
      user: resolved.user,
    };

    next();
  } catch {
    response.clearCookie(authConfig.session.cookieName, authConfig.cookies.session);

    next();
  }
};
