import { z } from "zod";

const apiBaseSchema = z
  .string()
  .refine(
    (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
    "NEXT_PUBLIC_API_BASE_URL must be an absolute URL or a root-relative path."
  );

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("MyNSUT"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_BASE_URL: apiBaseSchema.default("/api/backend"),
});

export const env = publicEnvSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});
