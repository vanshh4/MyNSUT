import type { CookieOptions, Request, Response } from "express";

import { authConfig } from "../../config/auth.js";
import { AUTH_COOKIE_NAMES, AUTH_ERROR_CODES } from "../../constants/auth.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { AuthError, invalidOAuthState } from "./auth.errors.js";
import { authenticateGoogleIdentity } from "./auth.service.js";
import { googleCallbackQuerySchema } from "./auth.validation.js";
import {
  createOAuthAttempt,
  exchangeAuthorizationCode,
  securelyEqual,
  verifyGoogleIdentity,
} from "./googleOAuth.service.js";
import {
  resolveSession,
  revokeAllSessions,
  revokeCurrentSession,
} from "./session.service.js";

function signedCookie(request: Request, name: string): string | undefined {
  const value: unknown = request.signedCookies?.[name];
  return typeof value === "string" ? value : undefined;
}

function clearOAuthCookies(response: Response): void {
  const options: CookieOptions = { ...authConfig.cookies.oauth, maxAge: undefined };
  response.clearCookie(AUTH_COOKIE_NAMES.OAUTH_STATE, options);
  response.clearCookie(AUTH_COOKIE_NAMES.OAUTH_NONCE, options);
  response.clearCookie(AUTH_COOKIE_NAMES.OAUTH_CODE_VERIFIER, options);
}

function setSessionCookie(response: Response, token: string, expiresAt: Date): void {
  response.cookie(authConfig.session.cookieName, token, {
    ...authConfig.cookies.session,
    expires: expiresAt,
  });
}

function failureUrl(code: string): string {
  const url = new URL(authConfig.redirects.failure);
  url.searchParams.set("code", code);
  return url.toString();
}

export function startGoogleLogin(_request: Request, response: Response): void {
  const attempt = createOAuthAttempt();
  response.cookie(AUTH_COOKIE_NAMES.OAUTH_STATE, attempt.state, authConfig.cookies.oauth);
  response.cookie(AUTH_COOKIE_NAMES.OAUTH_NONCE, attempt.nonce, authConfig.cookies.oauth);
  response.cookie(
    AUTH_COOKIE_NAMES.OAUTH_CODE_VERIFIER,
    attempt.codeVerifier,
    authConfig.cookies.oauth
  );
  response.redirect(302, attempt.authorizationUrl);
}

export async function handleGoogleCallback(request: Request, response: Response): Promise<void> {
  try {
    const query = googleCallbackQuerySchema.parse(request.query);
    if (query.error) {
      throw new AuthError(
        401,
        AUTH_ERROR_CODES.GOOGLE_AUTHENTICATION_FAILED,
        "Google authentication was cancelled or denied."
      );
    }

    const expectedState = signedCookie(request, AUTH_COOKIE_NAMES.OAUTH_STATE);
    const nonce = signedCookie(request, AUTH_COOKIE_NAMES.OAUTH_NONCE);
    const codeVerifier = signedCookie(request, AUTH_COOKIE_NAMES.OAUTH_CODE_VERIFIER);

    if (!query.code || !query.state || !expectedState || !nonce || !codeVerifier) {
      throw invalidOAuthState();
    }
    if (!securelyEqual(query.state, expectedState)) throw invalidOAuthState();

    const tokens = await exchangeAuthorizationCode(query.code, codeVerifier);
    const identity = await verifyGoogleIdentity(tokens.id_token, nonce);
    const result = await authenticateGoogleIdentity(identity, {
      ...(request.ip ? { ipAddress: request.ip } : {}),
      ...(request.get("user-agent") ? { userAgent: request.get("user-agent")! } : {}),
    });

    clearOAuthCookies(response);
    setSessionCookie(response, result.rawSessionToken, result.sessionExpiresAt);
    response.redirect(302, authConfig.redirects.success);
  } catch (error: unknown) {
    clearOAuthCookies(response);
    const code = error instanceof AuthError ? error.code : AUTH_ERROR_CODES.GOOGLE_AUTHENTICATION_FAILED;
    response.redirect(302, failureUrl(code));
  }
}

export function getCurrentUser(request: Request, response: Response): void {
  response.status(200).json(apiResponse(request.auth!.user, "Authenticated user retrieved."));
}

export async function refreshSession(request: Request, response: Response): Promise<void> {
  const rawToken = request.cookies[authConfig.session.cookieName] as string | undefined;
  if (!rawToken) throw invalidOAuthState();
  const session = await resolveSession(rawToken);
  if (session.renewed) setSessionCookie(response, rawToken, session.expiresAt);
  response.status(200).json(apiResponse(session.user, "Session is valid."));
}

export async function logout(request: Request, response: Response): Promise<void> {
  await revokeCurrentSession(request.auth!.sessionId);
  response.clearCookie(authConfig.session.cookieName, authConfig.cookies.session);
  response.status(200).json(apiResponse(null, "Logged out successfully."));
}

export async function logoutAllDevices(request: Request, response: Response): Promise<void> {
  await revokeAllSessions(request.auth!.userId);
  response.clearCookie(authConfig.session.cookieName, authConfig.cookies.session);
  response.status(200).json(apiResponse(null, "All sessions were revoked."));
}
