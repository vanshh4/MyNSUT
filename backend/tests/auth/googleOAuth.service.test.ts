import { beforeEach, describe, expect, it, vi } from "vitest";

const jwtVerify = vi.fn();
vi.mock("jose", () => ({
  createRemoteJWKSet: vi.fn(() => Symbol("jwks")),
  jwtVerify,
}));

const { createOAuthAttempt, securelyEqual, verifyGoogleIdentity } =
  await import("../../src/modules/auth/googleOAuth.service.js");

describe("Google OAuth service", () => {
  beforeEach(() => jwtVerify.mockReset());

  it("creates an authorization request with state, nonce, PKCE and safe scopes", () => {
    const attempt = createOAuthAttempt();
    const url = new URL(attempt.authorizationUrl);

    expect(attempt.state).toBeTruthy();
    expect(attempt.nonce).toBeTruthy();
    expect(attempt.codeVerifier).toBeTruthy();
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("scope")).toBe("openid email profile");
    expect(url.searchParams.get("hd")).toBe("nsut.ac.in");
    expect(url.searchParams.get("state")).toBe(attempt.state);
  });

  it("compares state values safely", () => {
    expect(securelyEqual("same-value", "same-value")).toBe(true);
    expect(securelyEqual("same-value", "different-value")).toBe(false);
  });

  it("accepts a verified NSUT Google identity", async () => {
    jwtVerify.mockResolvedValue({
      payload: {
        sub: "google-subject",
        email: "student@nsut.ac.in",
        email_verified: true,
        name: "Student Name",
        picture: "https://example.com/avatar.png",
        nonce: "expected-nonce",
      },
    });

    await expect(verifyGoogleIdentity("signed-id-token", "expected-nonce")).resolves.toEqual({
      subject: "google-subject",
      email: "student@nsut.ac.in",
      emailVerified: true,
      fullName: "Student Name",
      profileImageUrl: "https://example.com/avatar.png",
    });
  });

  it("rejects an unverified email", async () => {
    jwtVerify.mockResolvedValue({
      payload: {
        sub: "google-subject",
        email: "student@nsut.ac.in",
        email_verified: false,
        name: "Student Name",
        nonce: "expected-nonce",
      },
    });
    await expect(verifyGoogleIdentity("token", "expected-nonce")).rejects.toMatchObject({
      code: "EMAIL_NOT_VERIFIED",
    });
  });

  it("rejects an account outside the NSUT domain", async () => {
    jwtVerify.mockResolvedValue({
      payload: {
        sub: "google-subject",
        email: "student@gmail.com",
        email_verified: true,
        name: "Student Name",
        nonce: "expected-nonce",
      },
    });
    await expect(verifyGoogleIdentity("token", "expected-nonce")).rejects.toMatchObject({
      code: "INVALID_EMAIL_DOMAIN",
    });
  });

  it("rejects a nonce mismatch", async () => {
    jwtVerify.mockResolvedValue({
      payload: {
        sub: "google-subject",
        email: "student@nsut.ac.in",
        email_verified: true,
        name: "Student Name",
        nonce: "wrong-nonce",
      },
    });
    await expect(verifyGoogleIdentity("token", "expected-nonce")).rejects.toMatchObject({
      code: "INVALID_OAUTH_STATE",
    });
  });
});
