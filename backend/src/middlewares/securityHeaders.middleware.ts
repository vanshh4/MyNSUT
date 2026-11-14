import type { RequestHandler } from "express";
import helmet from "helmet";

import { env } from "../config/env.js";

const isProduction = env.NODE_ENV === "production";

const allowedOriginsList = env.FRONTEND_URL.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const securityHeadersMiddleware: RequestHandler = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "https://lh3.googleusercontent.com",
        "https://*.googleusercontent.com",
      ],
      connectSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://oauth2.googleapis.com",
        ...allowedOriginsList,
      ],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'", "https://accounts.google.com"],
      frameAncestors: ["'none'"],
    },
  },
  hsts: isProduction
    ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      }
    : false,
  frameguard: {
    action: "deny",
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin",
  },
  crossOriginResourcePolicy: {
    policy: "cross-origin",
  },
});
