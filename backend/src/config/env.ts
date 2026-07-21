import "dotenv/config";

import { z } from "zod";

const booleanString = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().max(65535).default(4000),
  API_PREFIX: z.string().startsWith("/").default("/api/v1"),
  APP_NAME: z.string().min(1).default("MyNSUT API"),
  LOG_LEVEL: z.enum(["combined", "common", "dev", "short", "tiny"]).default("dev"),
  FRONTEND_URL: z.string().min(1).default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(32).optional(),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  GOOGLE_CALLBACK_URL: z.string().url().optional(),
  SUPER_ADMIN_EMAIL: z.string().email().optional(),
  SUPER_ADMIN_ROLL_NUMBER: z.string().optional(),
  SUPER_ADMIN_NAME: z.string().optional(),
  TRUST_PROXY: booleanString.default("false"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid backend environment configuration:");
  console.error(z.prettifyError(parsed.error));
  throw new Error("Backend environment validation failed.");
}

export const env = parsed.data;
