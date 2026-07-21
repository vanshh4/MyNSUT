import crypto from "node:crypto";

import morgan from "morgan";
import type { RequestHandler } from "express";

import { env } from "../config/env.js";

export const requestIdMiddleware: RequestHandler = (request, response, next) => {
  const incomingRequestId = request.header("X-Request-ID")?.trim();
  const requestId = incomingRequestId || crypto.randomUUID();

  response.setHeader("X-Request-ID", requestId);
  response.locals.requestId = requestId;
  next();
};

morgan.token("request-id", (_request, response) => String(response.getHeader("X-Request-ID") ?? "-"));

export const requestLogger = morgan(`:method :url :status :response-time ms request-id=:request-id`, {
  skip: () => env.NODE_ENV === "test",
});
