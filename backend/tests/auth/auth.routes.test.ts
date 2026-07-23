import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/modules/auth/auth.controller.js", () => ({
  startGoogleLogin: (_req: express.Request, res: express.Response) =>
    res.redirect(302, "https://accounts.google.com/o/oauth2/v2/auth"),
  handleGoogleCallback: async (_req: express.Request, res: express.Response) => {
    res.redirect(302, "http://localhost:3000/auth/callback");
  },
  getCurrentUser: (req: express.Request, res: express.Response) =>
    res.status(200).json({ success: true, data: req.auth?.user ?? null }),
  refreshSession: async (_req: express.Request, res: express.Response) => {
    res.status(200).json({ success: true });
  },
  logout: async (_req: express.Request, res: express.Response) => {
    res.status(200).json({ success: true });
  },
  logoutAllDevices: async (_req: express.Request, res: express.Response) => {
    res.status(200).json({ success: true });
  },
}));
vi.mock("../../src/middlewares/authenticate.middleware.js", () => ({
  authenticateMiddleware: (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => {
    req.auth = {
      userId: "user",
      sessionId: "session",
      email: "student@nsut.ac.in",
      onboardingCompleted: false,
      roles: [],
      permissions: [],
      studentId: null,
      classId: null,
      user: {
        id: "user",
        email: "student@nsut.ac.in",
        fullName: "Student",
        profileImageUrl: null,
        status: "ACTIVE",
        onboardingCompleted: false,
        roles: [],
        permissions: [],
        student: null,
      },
    };
    next();
  },
}));

const { authRouter } = await import("../../src/modules/auth/auth.routes.js");
const app = express();
app.use(express.json());
app.use("/auth", authRouter);

describe("auth routes", () => {
  it("starts Google authentication", async () => {
    const response = await request(app).get("/auth/google");
    expect(response.status).toBe(302);
    expect(response.headers.location).toContain("accounts.google.com");
  });

  it("handles the callback route", async () => {
    const response = await request(app).get("/auth/google/callback?code=code&state=state");
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("http://localhost:3000/auth/callback");
  });

  it.each([
    ["get", "/auth/me"],
    ["post", "/auth/session/refresh"],
    ["post", "/auth/logout"],
    ["post", "/auth/logout-all"],
  ] as const)("registers %s %s", async (method, path) => {
    const response = await request(app)[method](path);
    expect(response.status).toBe(200);
  });
});
