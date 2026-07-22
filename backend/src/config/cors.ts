import type { CorsOptions } from "cors";

import { env } from "./env.js";

const allowedOrigins = new Set(
  env.FRONTEND_URL.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin is not allowed by the MyNSUT CORS policy."));
  },
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID", "X-CSRF-Token"],
  exposedHeaders: ["X-Request-ID"],
  maxAge: 86_400,
};
