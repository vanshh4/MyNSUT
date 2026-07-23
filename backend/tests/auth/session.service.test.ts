import { UserStatus } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const transaction = vi.fn();
vi.mock("../../src/db/prisma.js", () => ({
  prisma: { $transaction: transaction },
}));

const repository = vi.hoisted(() => ({
  findActiveSessions: vi.fn(), createSession: vi.fn(), revokeSessionsByIds: vi.fn(),
  findSessionByTokenHash: vi.fn(), revokeSessionById: vi.fn(), renewSession: vi.fn(),
  revokeAllUserSessions: vi.fn(),
}));
vi.mock("../../src/modules/auth/auth.repository.js", () => repository);

const { issueSession, resolveSession } = await import("../../src/modules/auth/session.service.js");

const baseUser = {
  id: "user-id", email: "student@nsut.ac.in", fullName: "Student", profileImageUrl: null,
  status: UserStatus.ACTIVE, onboardingCompleted: false, student: null, globalRoles: [],
};

describe("session service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    transaction.mockImplementation(async (callback: (tx: object) => Promise<unknown>) => callback({}));
    repository.createSession.mockResolvedValue({ id: "new-session" });
  });

  it("revokes the oldest active session before creating a fourth", async () => {
    repository.findActiveSessions.mockResolvedValue([{ id: "oldest" }, { id: "second" }, { id: "third" }]);
    await issueSession("user-id", { ipAddress: "127.0.0.1", userAgent: "Vitest" });
    expect(repository.revokeSessionsByIds).toHaveBeenCalledWith(expect.anything(), ["oldest"], expect.any(Date));
    expect(repository.createSession).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ userId: "user-id", ipAddress: "127.0.0.1", userAgent: "Vitest" }));
  });

  it("resolves a valid active session", async () => {
    repository.findSessionByTokenHash.mockResolvedValue({
      id: "session-id", revokedAt: null, expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), user: baseUser,
    });
    await expect(resolveSession("raw-token")).resolves.toMatchObject({ sessionId: "session-id", renewed: false });
  });

  it("rejects and revokes an expired session", async () => {
    repository.findSessionByTokenHash.mockResolvedValue({
      id: "session-id", revokedAt: null, expiresAt: new Date(Date.now() - 1000), user: baseUser,
    });
    await expect(resolveSession("raw-token")).rejects.toMatchObject({ code: "SESSION_EXPIRED" });
    expect(repository.revokeSessionById).toHaveBeenCalled();
  });

  it("renews a session when fewer than two days remain", async () => {
    repository.findSessionByTokenHash.mockResolvedValue({
      id: "session-id", revokedAt: null, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), user: baseUser,
    });
    repository.renewSession.mockResolvedValue({});
    await expect(resolveSession("raw-token")).resolves.toMatchObject({ renewed: true });
    expect(repository.renewSession).toHaveBeenCalled();
  });

  it.each([
    [UserStatus.SUSPENDED, "ACCOUNT_SUSPENDED"],
    [UserStatus.DELETED, "ACCOUNT_DELETED"],
  ])("denies %s accounts", async (status, code) => {
    repository.findSessionByTokenHash.mockResolvedValue({
      id: "session-id", revokedAt: null, expiresAt: new Date(Date.now() + 86400000), user: { ...baseUser, status },
    });
    await expect(resolveSession("raw-token")).rejects.toMatchObject({ code });
  });
});
