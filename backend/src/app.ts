import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { appConfig } from "./config/app.js";
import { corsOptions } from "./config/cors.js";
import { env } from "./config/env.js";
import { csrfProtectionMiddleware } from "./middlewares/csrf.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { apiLimiter, mutationLimiter } from "./middlewares/rateLimit.middleware.js";
import { requestIdMiddleware, requestLogger } from "./middlewares/requestLogger.middleware.js";
import { requestSizeMiddleware } from "./middlewares/requestSize.middleware.js";
import { securityHeadersMiddleware } from "./middlewares/securityHeaders.middleware.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.disable("x-powered-by");

// Crucial: trust upstream proxies (Render / Vercel proxy) to accurately resolve student client IPs
app.set("trust proxy", env.TRUST_PROXY);

// Request identification and audit logging
app.use(requestIdMiddleware);
app.use(requestLogger);

// Security headers with strict CSP and HSTS
app.use(securityHeadersMiddleware);

// Cross-Origin Resource Sharing policy
app.use(cors(corsOptions));

// Payload size defense against large-stream denial of service
app.use(requestSizeMiddleware);

// Global rate limiting and write mutation throttling
app.use(apiLimiter);
app.use(mutationLimiter);

// Cross-Site Request Forgery (CSRF) origin verification
app.use(csrfProtectionMiddleware);

// Cookie parsing and body deserialization
app.use(cookieParser(env.AUTH_SECRET));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Mount API router
app.use(appConfig.apiPrefix, apiRouter);

// Fallthrough 404 and global error handlers
app.use(notFoundMiddleware);
app.use(errorMiddleware);
