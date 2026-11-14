import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { errorMiddleware } from "../../src/middlewares/error.middleware.js";
import { requestSizeLimiter } from "../../src/middlewares/requestSize.middleware.js";

describe("Request Size Limiter Middleware", () => {
  const testApp = express();
  // Set limit to 500 bytes for test convenience
  testApp.use(requestSizeLimiter(500));
  testApp.use(express.json());

  testApp.post("/data", (_req, res) => {
    res.json({ success: true });
  });

  testApp.use(errorMiddleware);

  it("permits payloads within the allowed size limit", async () => {
    const smallPayload = { message: "Hello world" };
    const res = await request(testApp).post("/data").send(smallPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("rejects payloads exceeding the configured size limit with 413 Payload Too Large", async () => {
    // Generate large payload exceeding 500 bytes
    const largePayload = { largeString: "A".repeat(1000) };
    const res = await request(testApp).post("/data").send(largePayload);

    expect(res.status).toBe(413);
    expect(res.body.error.code).toBe("PAYLOAD_TOO_LARGE");
  });
});
