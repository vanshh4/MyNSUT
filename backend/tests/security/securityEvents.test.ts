import type { Request } from "express";
import { describe, expect, it } from "vitest";

import {
  clearRecentSecurityEvents,
  getRecentSecurityEvents,
  recordSecurityEvent,
} from "../../src/modules/security/securityEvents.service.js";

describe("SecurityEvents Service", () => {
  it("records a security event and redacts sensitive information", () => {
    clearRecentSecurityEvents();

    const logged = recordSecurityEvent({
      type: "AUTH_FAILURE",
      details: {
        email: "student@nsut.ac.in",
        token: "secret-token-12345",
        password: "supersecretpassword",
        authorization: "Bearer eyJhbGciOi...",
        nested: {
          client_secret: "hidden-google-secret",
          safeField: "safeValue",
        },
      },
    });

    expect(logged.eventType).toBe("AUTH_FAILURE");
    expect(logged.details.email).toBe("student@nsut.ac.in");
    expect(logged.details.token).toBe("[REDACTED]");
    expect(logged.details.password).toBe("[REDACTED]");
    expect(logged.details.authorization).toBe("[REDACTED]");
    expect((logged.details.nested as Record<string, unknown>).client_secret).toBe("[REDACTED]");
    expect((logged.details.nested as Record<string, unknown>).safeField).toBe("safeValue");

    const recent = getRecentSecurityEvents();
    expect(recent.length).toBe(1);
    expect(recent[0].eventType).toBe("AUTH_FAILURE");
  });

  it("extracts request metadata when request object is supplied", () => {
    clearRecentSecurityEvents();

    const mockReq = {
      ip: "192.168.1.100",
      method: "POST",
      originalUrl: "/api/v1/auth/google",
      headers: {
        "x-request-id": "req-xyz-987",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0)",
      },
      user: {
        id: "usr_mock_123",
      },
    };

    const logged = recordSecurityEvent({
      type: "CSRF_VIOLATION",
      req: mockReq as unknown as Request,
      details: { reason: "Bad origin" },
    });

    expect(logged.ip).toBe("192.168.1.100");
    expect(logged.method).toBe("POST");
    expect(logged.path).toBe("/api/v1/auth/google");
    expect(logged.requestId).toBe("req-xyz-987");
    expect(logged.userAgent).toBe("Mozilla/5.0 (Windows NT 10.0)");
    expect(logged.userId).toBe("usr_mock_123");
  });
});
