import request from "supertest";
import { describe, expect, it, vi } from "vitest";

import { app } from "../../src/app.js";
import { appConfig } from "../../src/config/app.js";
import { prisma } from "../../src/db/prisma.js";

describe("Health Check & Database Readiness", () => {
  it("returns 200 for standard liveness probe without database call", async () => {
    const res = await request(app).get("/api/v1/health");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("ok");
    expect(res.body.data.service).toBe(appConfig.name);
    expect(res.body.data.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(res.body.data.database).toBeUndefined();
  });

  it("returns 200 and connectivity metrics when database readiness probe succeeds", async () => {
    const querySpy = vi.spyOn(prisma, "$queryRaw").mockResolvedValueOnce([{ live: 1 }]);

    const res = await request(app).get("/api/v1/health?readiness=true");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("ok");
    expect(res.body.data.database.connected).toBe(true);
    expect(res.body.data.database.latencyMs).toBeGreaterThanOrEqual(0);

    querySpy.mockRestore();
  });

  it("returns 503 and degraded status when database readiness probe fails", async () => {
    const querySpy = vi
      .spyOn(prisma, "$queryRaw")
      .mockRejectedValueOnce(new Error("Connection refused at localhost:5432"));

    const res = await request(app).get("/api/v1/health?db=true");

    expect(res.status).toBe(503);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("degraded");
    expect(res.body.data.database.connected).toBe(false);
    expect(res.body.data.database.error).toContain("Connection refused");

    querySpy.mockRestore();
  });
});
