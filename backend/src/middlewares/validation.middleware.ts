import type { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/apiError.js";

export function validateQuery(schema: ZodSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ApiError(400, "Validation failed", { details: (error as any).errors }));
      } else {
        next(error);
      }
    }
  };
}

export function validateBody(schema: ZodSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ApiError(400, "Validation failed", { details: (error as any).errors }));
      } else {
        next(error);
      }
    }
  };
}

export function validateParams(schema: ZodSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ApiError(400, "Validation failed", { details: (error as any).errors }));
      } else {
        next(error);
      }
    }
  };
}
