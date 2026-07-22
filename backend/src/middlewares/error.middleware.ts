import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError, flattenError } from "zod";

import { appConfig } from "../config/app.js";
import { ApiError } from "../utils/apiError.js";

interface ErrorBody {
  success: false;
  message: string;
  error: {
    code: string;
    details?: unknown;
    requestId?: string;
    stack?: string;
  };
}

function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof ZodError) {
    return new ApiError(400, "Request validation failed.", {
      code: "VALIDATION_ERROR",
      details: flattenError(error),
      cause: error,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return new ApiError(409, "A record with the same unique value already exists.", {
        code: "DUPLICATE_RECORD",
        details: error.meta,
        cause: error,
      });
    }

    if (error.code === "P2003") {
      return new ApiError(409, "The operation conflicts with a related database record.", {
        code: "RELATION_CONFLICT",
        details: error.meta,
        cause: error,
      });
    }

    if (error.code === "P2025") {
      return new ApiError(404, "The requested database record was not found.", {
        code: "RECORD_NOT_FOUND",
        cause: error,
      });
    }
  }

  if (error instanceof SyntaxError && "body" in error) {
    return new ApiError(400, "The request body contains invalid JSON.", {
      code: "INVALID_JSON",
      cause: error,
    });
  }

  return new ApiError(500, "An unexpected server error occurred.", {
    code: "INTERNAL_SERVER_ERROR",
    cause: error,
    isOperational: false,
  });
}

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  const normalized = normalizeError(error);
  const requestId = response.locals.requestId as string | undefined;

  if (!normalized.isOperational || appConfig.isDevelopment) {
    console.error(error);
  }

  const body: ErrorBody = {
    success: false,
    message: normalized.message,
    error: {
      code: normalized.code,
      ...(normalized.details !== undefined ? { details: normalized.details } : {}),
      ...(requestId ? { requestId } : {}),
      ...(appConfig.isDevelopment ? { stack: normalized.stack } : {}),
    },
  };

  response.status(normalized.statusCode).json(body);
};
