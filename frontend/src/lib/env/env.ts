import { z } from "zod";

const isServer = typeof window === "undefined";
const isProduction = process.env.NODE_ENV === "production";

const apiBaseSchema = z
  .string()
  .refine(
    (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
    "NEXT_PUBLIC_API_BASE_URL must be an absolute URL or a root-relative path."
  );

function validateBackendInternalUrl(): string | undefined {
  if (!isServer) {
    // Non-NEXT_PUBLIC_ variables are not available in client-side browser bundles.
    return undefined;
  }

  const rawUrl = process.env.BACKEND_INTERNAL_URL?.trim();

  if (!isProduction) {
    // Development & Test: preserve localhost fallback
    return (rawUrl || "http://localhost:4000").replace(/\/$/, "");
  }

  // Production validation: require valid remote URL and reject localhost
  if (!rawUrl) {
    throw new Error(
      "[env.ts] FATAL: BACKEND_INTERNAL_URL environment variable is required in production.\n" +
        "Configure BACKEND_INTERNAL_URL in your hosting platform (e.g. Vercel) with the URL of your backend service (e.g., https://mynsut-backend.onrender.com)."
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error(
      `[env.ts] FATAL: BACKEND_INTERNAL_URL is not a valid URL: "${rawUrl}".\n` +
        "Provide a valid HTTP or HTTPS URL (e.g., https://mynsut-backend.onrender.com)."
    );
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(
      `[env.ts] FATAL: BACKEND_INTERNAL_URL must use http: or https: protocol. Received "${parsed.protocol}".`
    );
  }

  const hostname = parsed.hostname.toLowerCase();
  const isLoopback =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "0.0.0.0" ||
    hostname.startsWith("127.");

  if (isLoopback) {
    throw new Error(
      `[env.ts] FATAL: BACKEND_INTERNAL_URL cannot point to localhost or loopback address in production ("${rawUrl}").\n` +
        "Configure a remote backend URL (e.g. https://mynsut-backend.onrender.com) so server-side requests and proxy rewrites route correctly."
    );
  }

  return rawUrl.replace(/\/$/, "");
}

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("MyNSUT"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_BASE_URL: apiBaseSchema.default("/api/backend"),
  BACKEND_INTERNAL_URL: z.string().optional(),
});

const validatedBackendUrl = validateBackendInternalUrl();

export const env = publicEnvSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  BACKEND_INTERNAL_URL: validatedBackendUrl,
});
