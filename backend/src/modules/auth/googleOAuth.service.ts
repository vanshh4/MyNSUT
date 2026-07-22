import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

import { createRemoteJWKSet, jwtVerify } from "jose";

import { assertGoogleOAuthConfigured, authConfig } from "../../config/auth.js";
import {
  emailNotVerified,
  googleAuthenticationFailed,
  invalidEmailDomain,
  invalidOAuthResponse,
  invalidOAuthState,
} from "./auth.errors.js";
import type { GoogleIdentity, GoogleTokenResponse, OAuthAttempt } from "./auth.types.js";

const googleJwks = createRemoteJWKSet(new URL(authConfig.google.jwksUri));

function base64Url(bytes: Buffer): string {
  return bytes.toString("base64url");
}

function sha256Base64Url(value: string): string {
  return createHash("sha256").update(value).digest("base64url");
}

export function securelyEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function createOAuthAttempt(): OAuthAttempt {
  assertGoogleOAuthConfigured();

  const state = base64Url(randomBytes(32));
  const nonce = base64Url(randomBytes(32));
  const codeVerifier = base64Url(randomBytes(48));
  const codeChallenge = sha256Base64Url(codeVerifier);

  const url = new URL(authConfig.google.authorizationEndpoint);
  url.searchParams.set("client_id", authConfig.google.clientId);
  url.searchParams.set("redirect_uri", authConfig.google.callbackUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", authConfig.google.scopes.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("nonce", nonce);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("prompt", "select_account");
  url.searchParams.set("hd", authConfig.officialEmailDomain);

  return { state, nonce, codeVerifier, codeChallenge, authorizationUrl: url.toString() };
}

export async function exchangeAuthorizationCode(
  code: string,
  codeVerifier: string
): Promise<GoogleTokenResponse> {
  assertGoogleOAuthConfigured();

  const response = await fetch(authConfig.google.tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: authConfig.google.clientId,
      client_secret: authConfig.google.clientSecret,
      redirect_uri: authConfig.google.callbackUrl,
      grant_type: "authorization_code",
      code_verifier: codeVerifier,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok || !payload || typeof payload !== "object") {
    throw googleAuthenticationFailed({ status: response.status });
  }

  const token = payload as Partial<GoogleTokenResponse>;
  if (!token.id_token || !token.access_token || !token.token_type) {
    throw invalidOAuthResponse();
  }

  return token as GoogleTokenResponse;
}

export async function verifyGoogleIdentity(
  idToken: string,
  nonce: string
): Promise<GoogleIdentity> {
  assertGoogleOAuthConfigured();

  try {
    const { payload } = await jwtVerify(idToken, googleJwks, {
      issuer: ["https://accounts.google.com", "accounts.google.com"],
      audience: authConfig.google.clientId,
    });

    if (typeof payload.nonce !== "string" || !securelyEqual(payload.nonce, nonce)) {
      throw invalidOAuthState();
    }

    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      throw invalidOAuthResponse();
    }

    if (payload.email_verified !== true) {
      throw emailNotVerified();
    }

    const email = payload.email.trim().toLowerCase();
    if (!email.endsWith(`@${authConfig.officialEmailDomain}`)) {
      throw invalidEmailDomain();
    }

    const fullName =
      typeof payload.name === "string" && payload.name.trim() ? payload.name.trim() : email;
    const profileImageUrl = typeof payload.picture === "string" ? payload.picture : undefined;

    return {
      subject: payload.sub,
      email,
      emailVerified: true,
      fullName,
      ...(profileImageUrl ? { profileImageUrl } : {}),
    };
  } catch (error: unknown) {
    if (error instanceof Error && "statusCode" in error) throw error;
    throw googleAuthenticationFailed();
  }
}
