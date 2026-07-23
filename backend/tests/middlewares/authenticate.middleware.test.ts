import type { NextFunction, Request, Response } from "express";
import type { CookieOptions } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const resolveSession = vi.fn();
vi.mock("../../src/modules/auth/session.service.js", () => ({ resolveSession }));
const { authenticateMiddleware } = await import("../../src/middlewares/authenticate.middleware.js");

function createResponseMock() {
  const cookieMock = vi.fn<(name: string, value: string, options: CookieOptions) => void>();

  const response = {
    cookie: cookieMock,
  } as unknown as Response;

  return {
    response,
    cookieMock,
  };
}

describe("authenticateMiddleware", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects a missing session cookie", async () => {
    const request = { cookies: {} } as Request;
    const next = vi.fn() as NextFunction;
    await authenticateMiddleware(request, createResponseMock().response, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: "AUTHENTICATION_REQUIRED" }));
  });

  it("attaches a resolved authentication context", async () => {
    const user = {
      id: "user-id",
      email: "student@nsut.ac.in",
      fullName: "Student",
      profileImageUrl: null,
      status: "ACTIVE",
      onboardingCompleted: true,
      roles: ["STUDENT"],
      permissions: ["AUTH_LOGIN"],
      student: {
        id: "student-id",
        userId: "user-id",
        classId: "class-id",
        umsRollNumber: "2023UIT3324",
        admissionYear: 2023,
        branchCode: "UIT",
        branchName: "Information Technology",
        rollNumber: "3324",
        section: "2",
        graduationYear: 2027,
        currentSemester: null,
      },
    };
    resolveSession.mockResolvedValue({
      sessionId: "session-id",
      user,
      expiresAt: new Date(Date.now() + 10000),
      renewed: false,
    });
    const request = { cookies: { mynsut_session: "raw-token" } } as Request;
    const next = vi.fn() as NextFunction;
    await authenticateMiddleware(request, createResponseMock().response, next);
    expect(request.auth).toMatchObject({
      userId: "user-id",
      sessionId: "session-id",
      studentId: "student-id",
      classId: "class-id",
    });
    expect(next).toHaveBeenCalledWith();
  });

  it("refreshes the cookie after sliding renewal", async () => {
    resolveSession.mockResolvedValue({
      sessionId: "session-id",
      expiresAt: new Date(Date.now() + 10_000),
      renewed: true,
      user: {
        id: "user-id",
        email: "student@nsut.ac.in",
        fullName: "Student",
        profileImageUrl: null,
        status: "ACTIVE",
        onboardingCompleted: false,
        roles: [],
        permissions: [],
        student: null,
      },
    });

    const { response, cookieMock } = createResponseMock();

    await authenticateMiddleware(
      {
        cookies: {
          mynsut_session: "raw-token",
        },
      } as Request,
      response,
      vi.fn()
    );

    expect(cookieMock).toHaveBeenCalledOnce();

    const cookieCall = cookieMock.mock.calls[0];

    expect(cookieCall?.[0]).toBe("mynsut_session");
    expect(cookieCall?.[1]).toBe("raw-token");
    expect(cookieCall?.[2].expires).toBeInstanceOf(Date);
  });
});
