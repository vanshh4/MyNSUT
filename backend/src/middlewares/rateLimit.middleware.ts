import type { Request, Response } from "express";
import rateLimit, { type Options } from "express-rate-limit";

import { env } from "../config/env.js";
import { recordSecurityEvent } from "../modules/security/securityEvents.service.js";

const isTest = env.NODE_ENV === "test";

function createRateLimitHandler(message: string) {
  return (req: Request, res: Response, _next: unknown, options: Options) => {
    recordSecurityEvent({
      type: "RATE_LIMIT_EXCEEDED",
      req,
      details: {
        ip: req.ip,
        path: req.originalUrl || req.url,
        method: req.method,
        statusCode: options.statusCode,
      },
    });

    res.status(options.statusCode).json({
      success: false,
      message,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        details: {
          retryAfterSeconds: res.getHeader("Retry-After"),
        },
      },
    });
  };
}

/**
 * General API rate limiter applied to all /api/v1 endpoints.
 * Window: 15 minutes, Max: 300 requests (configurable via env).
 */
export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: (req) => isTest && req.headers["x-test-rate-limit"] !== "true",
  handler: createRateLimitHandler("Too many requests from this IP. Please try again later."),
});

/**
 * Strict rate limiter applied to authentication endpoints (/api/v1/auth/*).
 * Window: 15 minutes, Max: 30 requests.
 */
export const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_AUTH_MAX,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: (req) => isTest && req.headers["x-test-rate-limit"] !== "true",
  handler: createRateLimitHandler("Too many authentication attempts. Please try again later."),
});

/**
 * Mutation rate limiter applied to state-changing operations (POST, PUT, PATCH, DELETE).
 * Window: 1 minute, Max: 60 requests.
 */
export const mutationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: (req) => {
    if (isTest && req.headers["x-test-rate-limit"] !== "true") return true;
    return req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS";
  },
  handler: createRateLimitHandler("Too many write requests. Please slow down and try again shortly."),
});
