import type { NextFunction, Request, Response } from "express";

import { recordSecurityEvent } from "../modules/security/securityEvents.service.js";
import { ApiError } from "../utils/apiError.js";

const DEFAULT_MAX_SIZE_BYTES = 1024 * 1024; // 1MB
const UPLOAD_MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Validates Content-Length header early before the body parser streams or buffers
 * large payloads into memory, preventing denial-of-service memory exhaustion.
 */
export function requestSizeLimiter(
  maxBytes: number = DEFAULT_MAX_SIZE_BYTES
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const rawLength = req.headers["content-length"];
    if (!rawLength) {
      next();
      return;
    }

    const contentLength = Number.parseInt(rawLength, 10);
    if (Number.isNaN(contentLength)) {
      next();
      return;
    }

    // Dynamic threshold: file upload paths allow up to 10MB
    const limit = req.path.includes("/upload") || req.path.includes("/attachments")
      ? UPLOAD_MAX_SIZE_BYTES
      : maxBytes;

    if (contentLength > limit) {
      recordSecurityEvent({
        type: "PAYLOAD_TOO_LARGE",
        req,
        details: {
          contentLength,
          limit,
          path: req.originalUrl || req.url,
        },
      });

      next(
        new ApiError(
          413,
          `Request payload of ${contentLength} bytes exceeds the maximum limit of ${limit} bytes.`,
          {
            code: "PAYLOAD_TOO_LARGE",
            details: { contentLength, limit },
          }
        )
      );
      return;
    }

    next();
  };
}

export const requestSizeMiddleware = requestSizeLimiter(DEFAULT_MAX_SIZE_BYTES);
