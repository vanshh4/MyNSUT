import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { csrfProtectionMiddleware } from "../../src/middlewares/csrf.middleware.js";
import { errorMiddleware } from "../../src/middlewares/error.middleware.js";

describe("CSRF Protection Middleware", () => {
  const testApp = express();
  testApp.use(express.json());
  testApp.use(csrfProtectionMiddleware);

  testApp.get("/test", (_req, res) => {
    res.json({ ok: true });
  });
  testApp.post("/test", (_req, res) => {
    res.json({ ok: true });
  });

  testApp.use(errorMiddleware);

  it("permits safe GET requests without Origin or Referer", async () => {
    const res = await request(testApp).get("/test");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("permits state-changing POST requests from an allowed origin", async () => {
    const res = await request(testApp)
      .post("/test")
      .set("Origin", "http://localhost:3000")
      .send({ action: "test" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("rejects state-changing POST requests from an unauthorized origin", async () => {
    const res = await request(testApp)
      .post("/test")
      .set("Origin", "https://malicious-attacker.com")
      .send({ action: "exploit" });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("CSRF_FORBIDDEN");
  });

  it("rejects state-changing POST requests with an unauthorized referer", async () => {
    const res = await request(testApp)
      .post("/test")
      .set("Referer", "https://evil.com/phishing/page")
      .send({ action: "exploit" });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("CSRF_FORBIDDEN");
  });

  it("permits POST requests with an allowed referer", async () => {
    const res = await request(testApp)
      .post("/test")
      .set("Referer", "http://localhost:3000/dashboard")
      .send({ action: "save" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
