import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../../src/app.js";

describe("Security Headers Middleware", () => {
  it("attaches defensive security headers to API responses", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("DENY");
    expect(response.headers["x-xss-protection"]).toBe("0"); // Helmet v8 sets 0 to prevent XSS filter vulnerabilities
    expect(response.headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(response.headers["content-security-policy"]).toBeDefined();
    expect(response.headers["content-security-policy"]).toContain("default-src 'self'");
    expect(response.headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  });
});
