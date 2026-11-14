import express from "express";
import rateLimit from "express-rate-limit";
import request from "supertest";
import { describe, expect, it } from "vitest";

describe("Rate Limiting Middleware", () => {
  const testApp = express();

  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 2,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (_req, res, _next, options) => {
      res.status(options.statusCode).json({
        success: false,
        message: "Too many requests",
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          details: { retryAfter: res.getHeader("Retry-After") },
        },
      });
    },
  });

  testApp.use(limiter);
  testApp.get("/rate-test", (_req, res) => {
    res.json({ ok: true });
  });

  it("permits requests within quota and enforces 429 when threshold is breached", async () => {
    const res1 = await request(testApp).get("/rate-test");
    expect(res1.status).toBe(200);

    const res2 = await request(testApp).get("/rate-test");
    expect(res2.status).toBe(200);

    const res3 = await request(testApp).get("/rate-test");
    expect(res3.status).toBe(429);
    expect(res3.body.error.code).toBe("RATE_LIMIT_EXCEEDED");
    expect(res3.headers["retry-after"]).toBeDefined();
  });
});
