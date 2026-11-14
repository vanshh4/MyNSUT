import type { NextFunction, Request, Response } from "express";

import { appConfig } from "../config/app.js";
import { isAllowedOrigin } from "../config/cors.js";
import { recordSecurityEvent } from "../modules/security/securityEvents.service.js";
import { ApiError } from "../utils/apiError.js";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function extractOrigin(headerValue: string | undefined): string | null {
  if (!headerValue) return null;
  try {
    const url = new URL(headerValue);
    return url.origin;
  } catch {
    return headerValue;
  }
}

/**
 * Validates the Origin and Referer headers on state-changing HTTP requests
 * to guard against Cross-Site Request Forgery (CSRF).
 */
export function csrfProtectionMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Safe idempotent methods do not mutate state
  if (!MUTATING_METHODS.has(req.method.toUpperCase())) {
    next();
    return;
  }

  // Google OAuth callback is a top-level browser redirect, handled securely via signed state cookie & PKCE
  if (req.path.endsWith("/auth/google/callback")) {
    next();
    return;
  }

  const rawOrigin = req.headers.origin;
  const rawReferer = req.headers.referer;

  const origin = rawOrigin ? extractOrigin(rawOrigin) : null;
  const refererOrigin = rawReferer ? extractOrigin(rawReferer) : null;

  // If Origin header is present, it MUST match allowed origins
  if (origin) {
    if (isAllowedOrigin(origin)) {
      next();
      return;
    }

    recordSecurityEvent({
      type: "CSRF_VIOLATION",
      req,
      details: {
        reason: "Origin header mismatch",
        origin,
      },
    });

    next(
      new ApiError(403, "Cross-Site Request Forgery (CSRF) validation failed: Invalid Origin.", {
        code: "CSRF_FORBIDDEN",
      })
    );
    return;
  }

  // If Referer header is present, its origin component MUST match allowed origins
  if (refererOrigin) {
    if (isAllowedOrigin(refererOrigin)) {
      next();
      return;
    }

    recordSecurityEvent({
      type: "CSRF_VIOLATION",
      req,
      details: {
        reason: "Referer header mismatch",
        referer: rawReferer,
        refererOrigin,
      },
    });

    next(
      new ApiError(403, "Cross-Site Request Forgery (CSRF) validation failed: Invalid Referer.", {
        code: "CSRF_FORBIDDEN",
      })
    );
    return;
  }

  // If both Origin and Referer are absent:
  // In development/test or for non-browser programmatic clients sending custom headers (e.g. application/json),
  // modern browsers cannot send JSON with custom headers cross-site without triggering a CORS preflight.
  const contentType = req.headers["content-type"] ?? "";
  const hasJsonContent = contentType.includes("application/json");
  const hasCustomHeader = Boolean(req.headers["x-request-id"] || req.headers["x-requested-with"]);

  if (appConfig.isDevelopment || appConfig.isTest || hasJsonContent || hasCustomHeader) {
    next();
    return;
  }

  // If a request in production has no Origin, no Referer, and no CORS-preflighted headers on a mutation:
  recordSecurityEvent({
    type: "CSRF_VIOLATION",
    req,
    details: {
      reason: "Missing Origin and Referer headers on mutating request",
    },
  });

  next(
    new ApiError(403, "Cross-Site Request Forgery (CSRF) validation failed: Missing origin headers.", {
      code: "CSRF_FORBIDDEN",
    })
  );
}
