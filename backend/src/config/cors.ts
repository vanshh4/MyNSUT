import type { CorsOptions } from "cors";

import { appConfig } from "./app.js";
import { env } from "./env.js";
import { ApiError } from "../utils/apiError.js";

const allowedOrigins = new Set(
  env.FRONTEND_URL.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      !origin || 
      allowedOrigins.has(origin) || 
      (appConfig.isDevelopment && (origin.startsWith("http://192.168.") || origin.startsWith("http://10.") || origin.startsWith("http://172.")))
    ) {
      callback(null, true);
      return;
    }

    callback(new ApiError(403, "Origin is not allowed by the MyNSUT CORS policy.", { code: "CORS_NOT_ALLOWED" }));
  },
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID", "X-CSRF-Token"],
  exposedHeaders: ["X-Request-ID"],
  maxAge: 86_400,
};
