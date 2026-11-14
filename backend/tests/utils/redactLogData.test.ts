import { describe, it, expect } from "vitest";
import { redactLogData } from "../../src/utils/redactLogData.js";

describe("redactLogData", () => {
  it("redacts sensitive fields in shallow objects", () => {
    const data = {
      email: "student@nsut.ac.in",
      password: "super-secret-password",
      token: "secret-token",
      authorization: "Bearer secret-bearer-token",
      role: "STUDENT",
    };

    const result = redactLogData(data);
    expect(result.email).toBe("student@nsut.ac.in");
    expect(result.password).toBe("[REDACTED]");
    expect(result.token).toBe("[REDACTED]");
    expect(result.authorization).toBe("[REDACTED]");
    expect(result.role).toBe("STUDENT");
  });

  it("redacts sensitive fields in nested objects and arrays", () => {
    const data = {
      user: {
        id: "123",
        credentials: {
          clientSecret: "top-secret",
          codeVerifier: "verifier-123",
        },
      },
      tokens: [
        { type: "access_token", value: "abc" },
        { type: "public", value: "hello" },
      ],
    };

    const result = redactLogData(data);
    expect(result.user.credentials.clientSecret).toBe("[REDACTED]");
    expect(result.user.credentials.codeVerifier).toBe("[REDACTED]");
    expect(result.user.id).toBe("123");
  });

  it("redacts cookie key-value strings", () => {
    const cookieHeader = "mynsut_session=secret_token_123; other_cookie=xyz";
    const result = redactLogData(cookieHeader);
    expect(result).toBe("mynsut_session=[REDACTED]; other_cookie=[REDACTED]");
  });

  it("leaves primitives and non-sensitive inputs intact", () => {
    expect(redactLogData(null)).toBeNull();
    expect(redactLogData(undefined)).toBeUndefined();
    expect(redactLogData(42)).toBe(42);
    expect(redactLogData(true)).toBe(true);
    expect(redactLogData("clean string")).toBe("clean string");
  });
});
