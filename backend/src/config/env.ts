import "dotenv/config";

import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional()
);

const optionalEmail = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().email().optional()
);

const booleanString = z.enum(["true", "false"]).transform((value) => value === "true");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().max(65535).default(4000),
  API_PREFIX: z.string().startsWith("/").default("/api/v1"),
  APP_NAME: z.string().min(1).default("MyNSUT API"),
  LOG_LEVEL: z.enum(["combined", "common", "dev", "short", "tiny"]).default("dev"),
  TRUST_PROXY: booleanString.default(false),
  FRONTEND_URL: z.string().min(1).default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_CALLBACK_URL: z.string().url(),
  FRONTEND_AUTH_SUCCESS_URL: z.string().min(1),
  FRONTEND_AUTH_FAILURE_URL: z.string().min(1),
  SESSION_COOKIE_NAME: z.string().min(1).default("mynsut_session"),
  SUPER_ADMIN_EMAIL: optionalEmail,
  SUPER_ADMIN_ROLL_NUMBER: optionalString,
  SUPER_ADMIN_NAME: optionalString,
  STORAGE_PROVIDER: optionalString,
  STORAGE_BUCKET: optionalString,
  STORAGE_ACCESS_KEY: optionalString,
  STORAGE_SECRET_KEY: optionalString,
  STORAGE_PUBLIC_URL: optionalString,
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid backend environment configuration:");
  console.error(z.prettifyError(parsed.error));
  throw new Error("Backend environment validation failed.");
}

export const env = parsed.data;
