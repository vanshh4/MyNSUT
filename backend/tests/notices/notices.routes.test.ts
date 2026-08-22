import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import express from "express";
import { noticesRoutes } from "../../src/modules/notices/notices.routes.js";
import { noticesService } from "../../src/modules/notices/notices.service.js";

// Mock middleware to simulate auth and RBAC
vi.mock("../../src/middlewares/auth.js", () => ({
  requireAuth: (req: any, res: any, next: any) => {
    req.user = { id: "user1" };
    next();
  }
}));

vi.mock("../../src/middlewares/rbac.js", () => ({
  requirePermission: () => (req: any, res: any, next: any) => next()
}));

vi.mock("../../src/modules/notices/notices.service.js");

const app = express();
app.use(express.json());
app.use("/notices", noticesRoutes);

describe("Notices Routes", () => {
  it("GET /notices should return paginated notices", async () => {
    vi.mocked(noticesService.getNotices).mockResolvedValue({
      data: [],
      meta: { page: 1, limit: 10, totalCount: 0, totalPages: 0 }
    });

    const res = await request(app).get("/notices");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /notices should create notice", async () => {
    vi.mocked(noticesService.createNotice).mockResolvedValue({ id: "1", title: "Test" } as any);

    const res = await request(app).post("/notices").send({
      title: "Test",
      category: "ACADEMIC",
      sourceAuthority: "Dean",
      officialUrl: "https://nsut.ac.in/test.pdf",
      publishedAt: new Date().toISOString()
    });
    
    expect(res.status).toBe(201);
  });
});
