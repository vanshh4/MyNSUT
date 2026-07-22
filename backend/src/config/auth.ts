import type { CookieOptions } from "express";

import { AUTH_COOKIE_NAMES, OFFICIAL_EMAIL_DOMAIN } from "../constants/auth.js";
import { env } from "./env.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

const isProduction = env.NODE_ENV === "production";

export const authConfig = {
  provider: "google",
  officialEmailDomain: OFFICIAL_EMAIL_DOMAIN,
  google: {
    issuer: "https://accounts.google.com",
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackUrl: env.GOOGLE_CALLBACK_URL,
    scopes: ["openid", "email", "profile"] as const,
  },
  redirects: {
    success: env.FRONTEND_AUTH_SUCCESS_URL,
    failure: env.FRONTEND_AUTH_FAILURE_URL,
  },
  session: {
    cookieName: env.SESSION_COOKIE_NAME ?? AUTH_COOKIE_NAMES.SESSION,
    durationMs: 5 * DAY_MS,
    refreshThresholdMs: 2 * DAY_MS,
    maximumActiveSessions: 3,
  },
  oauthAttempt: {
    durationMs: 10 * MINUTE_MS,
  },
  cookies: {
    session: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      signed: false,
    } satisfies CookieOptions,
    oauth: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      signed: true,
      maxAge: 10 * MINUTE_MS,
    } satisfies CookieOptions,
  },
} as const;

export function assertGoogleOAuthConfigured(): void {
  const missing = [
    ["GOOGLE_CLIENT_ID", authConfig.google.clientId],
    ["GOOGLE_CLIENT_SECRET", authConfig.google.clientSecret],
    ["GOOGLE_CALLBACK_URL", authConfig.google.callbackUrl],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Google OAuth configuration is incomplete: ${missing.join(", ")}`);
  }
}
