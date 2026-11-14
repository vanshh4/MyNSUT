import crypto from "node:crypto";
import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { app } from "../../src/app.js";
import { authConfig } from "../../src/config/auth.js";
import { AUTH_COOKIE_NAMES } from "../../src/constants/auth.js";
import * as googleOAuthService from "../../src/modules/auth/googleOAuth.service.js";
import * as authService from "../../src/modules/auth/auth.service.js";
import * as sessionService from "../../src/modules/auth/session.service.js";

describe("Smoke Test: Next.js Proxy Rewrite, Redirects, and Set-Cookie Preservation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("1. OAuth Start: Multi-Cookie Generation and Redirect", () => {
    it("preserves 302 status, Location redirect, and multiple distinct Set-Cookie headers", async () => {
      const response = await request(app).get("/api/v1/auth/google");

      // Verify 302 Redirect
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain("accounts.google.com");

      // Verify multiple Set-Cookie headers are returned as distinct entries (not collapsed)
      const setCookieHeaders = response.headers["set-cookie"];
      expect(Array.isArray(setCookieHeaders)).toBe(true);
      expect(setCookieHeaders.length).toBe(3);

      const cookieStrings = setCookieHeaders.join("; ");
      expect(cookieStrings).toContain(AUTH_COOKIE_NAMES.OAUTH_STATE);
      expect(cookieStrings).toContain(AUTH_COOKIE_NAMES.OAUTH_NONCE);
      expect(cookieStrings).toContain(AUTH_COOKIE_NAMES.OAUTH_CODE_VERIFIER);

      // Verify security attributes on all OAuth attempt cookies
      for (const cookie of setCookieHeaders) {
        expect(cookie.toLowerCase()).toContain("httponly");
        expect(cookie.toLowerCase()).toContain("path=/");
        expect(cookie.toLowerCase()).toContain("samesite=lax");
      }
    });
  });

  describe("2. OAuth Callback: Set-Cookie Preservation, Cookie Clearing & Redirect", () => {
    it("sets session cookie, clears OAuth cookies, and redirects to frontend callback", async () => {
      const mockRawToken = "test_raw_session_token_12345678901234567890";
      const mockExpiresAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
      const testState = "test_oauth_state";
      const testNonce = "test_oauth_nonce";
      const testVerifier = "test_code_verifier";

      vi.spyOn(googleOAuthService, "exchangeAuthorizationCode").mockResolvedValue({
        id_token: "mock_id_token",
        access_token: "mock_access_token",
      });

      vi.spyOn(googleOAuthService, "verifyGoogleIdentity").mockResolvedValue({
        sub: "google-sub-123",
        email: "student@nsut.ac.in",
        name: "Test Student",
        picture: "https://example.com/pic.jpg",
      });

      vi.spyOn(authService, "authenticateGoogleIdentity").mockResolvedValue({
        rawSessionToken: mockRawToken,
        sessionExpiresAt: mockExpiresAt,
        user: {
          id: "user-123",
          email: "student@nsut.ac.in",
          fullName: "Test Student",
          profileImageUrl: null,
          status: "ACTIVE",
          onboardingCompleted: true,
          roles: [],
          permissions: [],
          student: null,
        },
      });

      // Sign the cookies as cookieParser(AUTH_SECRET) does
      const signedState = `s:${testState}.${crypto.createHmac("sha256", process.env.AUTH_SECRET!).update(testState).digest("base64").replace(/=+$/, "")}`;
      const signedNonce = `s:${testNonce}.${crypto.createHmac("sha256", process.env.AUTH_SECRET!).update(testNonce).digest("base64").replace(/=+$/, "")}`;
      const signedVerifier = `s:${testVerifier}.${crypto.createHmac("sha256", process.env.AUTH_SECRET!).update(testVerifier).digest("base64").replace(/=+$/, "")}`;

      const response = await request(app)
        .get(`/api/v1/auth/google/callback?code=mock_code&state=${testState}`)
        .set(
          "Cookie",
          [
            `${AUTH_COOKIE_NAMES.OAUTH_STATE}=${signedState}`,
            `${AUTH_COOKIE_NAMES.OAUTH_NONCE}=${signedNonce}`,
            `${AUTH_COOKIE_NAMES.OAUTH_CODE_VERIFIER}=${signedVerifier}`,
          ].join("; ")
        );

      // Verify redirect to frontend success URL
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe(authConfig.redirects.success);

      // Verify Set-Cookie headers
      const setCookies: string[] = response.headers["set-cookie"] || [];
      expect(Array.isArray(setCookies)).toBe(true);

      // Check session cookie is set
      const sessionCookie = setCookies.find((c) => c.startsWith(`${authConfig.session.cookieName}=`));
      expect(sessionCookie).toBeDefined();
      expect(sessionCookie).toContain(mockRawToken);
      expect(sessionCookie?.toLowerCase()).toContain("httponly");
      expect(sessionCookie?.toLowerCase()).toContain("path=/");
      expect(sessionCookie?.toLowerCase()).toContain("samesite=lax");

      // Check OAuth state cookies are cleared (have expires in past)
      const clearedState = setCookies.find((c) => c.startsWith(`${AUTH_COOKIE_NAMES.OAUTH_STATE}=`));
      expect(clearedState).toBeDefined();
      expect(clearedState).toContain("Expires=");
    });

    it("redirects to frontend error URL when OAuth state is invalid or missing", async () => {
      const response = await request(app).get("/api/v1/auth/google/callback?code=bad_code&state=bad_state");

      expect(response.status).toBe(302);
      expect(response.headers.location).toContain(authConfig.redirects.failure);
      expect(response.headers.location).toContain("code=INVALID_OAUTH_STATE");
    });
  });

  describe("3. Session Cookie Authentication & Sliding Expiration", () => {
    it("authenticates requests passing the session cookie", async () => {
      const mockUser = {
        id: "user-123",
        email: "student@nsut.ac.in",
        fullName: "Test Student",
        profileImageUrl: null,
        status: "ACTIVE" as const,
        onboardingCompleted: true,
        roles: [],
        permissions: [],
        student: null,
      };

      vi.spyOn(sessionService, "resolveSession").mockResolvedValue({
        user: mockUser,
        sessionId: "session-123",
        renewed: false,
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      });

      const response = await request(app)
        .get("/api/v1/auth/me")
        .set("Cookie", `${authConfig.session.cookieName}=valid_session_token`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe("user-123");
    });

    it("renews session cookie with sliding expiration when renewed is true", async () => {
      const renewedExpiresAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

      vi.spyOn(sessionService, "resolveSession").mockResolvedValue({
        user: {
          id: "user-123",
          email: "student@nsut.ac.in",
          fullName: "Test Student",
          profileImageUrl: null,
          status: "ACTIVE" as const,
          onboardingCompleted: true,
          roles: [],
          permissions: [],
          student: null,
        },
        sessionId: "session-123",
        renewed: true,
        expiresAt: renewedExpiresAt,
      });

      const response = await request(app)
        .post("/api/v1/auth/session/refresh")
        .set("Cookie", `${authConfig.session.cookieName}=token_to_refresh`);

      expect(response.status).toBe(200);
      const setCookies = response.headers["set-cookie"] || [];
      const sessionCookie = setCookies.find((c: string) => c.startsWith(`${authConfig.session.cookieName}=`));
      expect(sessionCookie).toBeDefined();
      expect(sessionCookie?.toLowerCase()).toContain("httponly");
      expect(sessionCookie?.toLowerCase()).toContain("path=/");
    });
  });

  describe("4. Logout: Session Revocation and Cookie Clearance", () => {
    it("clears the session cookie upon logout", async () => {
      vi.spyOn(sessionService, "resolveSession").mockResolvedValue({
        user: {
          id: "user-123",
          email: "student@nsut.ac.in",
          fullName: "Test Student",
          profileImageUrl: null,
          status: "ACTIVE" as const,
          onboardingCompleted: true,
          roles: [],
          permissions: [],
          student: null,
        },
        sessionId: "session-123",
        renewed: false,
        expiresAt: new Date(),
      });

      vi.spyOn(sessionService, "revokeCurrentSession").mockResolvedValue();

      const response = await request(app)
        .post("/api/v1/auth/logout")
        .set("Cookie", `${authConfig.session.cookieName}=token_to_logout`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const setCookies: string[] = response.headers["set-cookie"] || [];
      const clearedCookie = setCookies.find((c) => c.startsWith(`${authConfig.session.cookieName}=`));
      expect(clearedCookie).toBeDefined();
      // Cookie is cleared by setting expires to Thu, 01 Jan 1970
      expect(clearedCookie).toContain("Expires=");
    });
  });

  describe("5. Proxy Headers & Security Invariants", () => {
    it("preserves X-Request-ID throughout the request lifecycle", async () => {
      const customRequestId = "proxy-req-id-uuid-98765";
      const response = await request(app)
        .get("/api/v1/auth/google")
        .set("X-Request-ID", customRequestId);

      expect(response.headers["x-request-id"]).toBe(customRequestId);
    });

    it("enforces CORS credentials support for the frontend origin", async () => {
      const response = await request(app)
        .options("/api/v1/auth/me")
        .set("Origin", "http://localhost:3000")
        .set("Access-Control-Request-Method", "GET");

      expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
      expect(response.headers["access-control-allow-credentials"]).toBe("true");
    });
  });
});

