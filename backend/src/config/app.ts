import { env } from "./env.js";

export const appConfig = {
  name: env.APP_NAME,
  environment: env.NODE_ENV,
  port: env.PORT,
  apiPrefix: env.API_PREFIX,
  isProduction: env.NODE_ENV === "production",
  isDevelopment: env.NODE_ENV === "development",
} as const;
