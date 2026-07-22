import { createHash, randomBytes } from "node:crypto";

import { UserStatus } from "@prisma/client";

import { authConfig } from "../../config/auth.js";
import { prisma } from "../../db/prisma.js";
import { accountDeleted, accountSuspended, invalidSession, sessionExpired } from "./auth.errors.js";
import * as authRepository from "./auth.repository.js";
import type { ResolvedSession, SafeAuthenticatedUser, SessionMetadata } from "./auth.types.js";

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

function createRawToken(): string {
  return randomBytes(48).toString("base64url");
}

function mapUser(
  record: NonNullable<Awaited<ReturnType<typeof authRepository.findSessionByTokenHash>>>["user"]
): SafeAuthenticatedUser {
  const roles = [...new Set(record.globalRoles.map(({ role }) => role.code))];
  const permissions = [
    ...new Set(
      record.globalRoles.flatMap(({ role }) =>
        role.permissions.map(({ permission }) => permission.code)
      )
    ),
  ];

  return {
    id: record.id,
    email: record.email,
    fullName: record.fullName,
    profileImageUrl: record.profileImageUrl,
    status: record.status,
    onboardingCompleted: record.onboardingCompleted,
    roles,
    permissions,
    student: record.student
      ? {
          id: record.student.id,
          umsRollNumber: record.student.umsRollNumber,
          admissionYear: record.student.admissionYear,
          branchCode: record.student.branchCode,
          section: record.student.section,
          graduationYear: record.student.graduationYear,
          classId: record.student.classId,
        }
      : null,
  } as SafeAuthenticatedUser;
}

export async function issueSession(userId: string, metadata: SessionMetadata) {
  const rawSessionToken = createRawToken();
  const tokenHash = hashToken(rawSessionToken);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + authConfig.session.durationMs);

  const session = await prisma.$transaction(async (tx) => {
    const active = await authRepository.findActiveSessions(tx, userId, now);
    const overflow = Math.max(0, active.length - authConfig.session.maximumActiveSessions + 1);
    if (overflow > 0) {
      await authRepository.revokeSessionsByIds(
        tx,
        active.slice(0, overflow).map(({ id }) => id),
        now
      );
    }

    return authRepository.createSession(tx, {
      userId,
      tokenHash,
      expiresAt,
      ...(metadata.ipAddress ? { ipAddress: metadata.ipAddress } : {}),
      ...(metadata.userAgent ? { userAgent: metadata.userAgent } : {}),
    });
  });

  return { rawSessionToken, sessionId: session.id, expiresAt };
}

export async function resolveSession(rawSessionToken: string): Promise<ResolvedSession> {
  const record = await authRepository.findSessionByTokenHash(prisma, hashToken(rawSessionToken));
  if (!record || record.revokedAt) throw invalidSession();

  const now = new Date();
  if (record.expiresAt.getTime() <= now.getTime()) {
    await authRepository.revokeSessionById(prisma, record.id, now);
    throw sessionExpired();
  }

  if (record.user.status === UserStatus.SUSPENDED) throw accountSuspended();
  if (record.user.status === UserStatus.DELETED) throw accountDeleted();

  const shouldRenew =
    record.expiresAt.getTime() - now.getTime() <= authConfig.session.refreshThresholdMs;
  let expiresAt = record.expiresAt;

  if (shouldRenew) {
    expiresAt = new Date(now.getTime() + authConfig.session.durationMs);
    await authRepository.renewSession(prisma, record.id, expiresAt, now);
  }

  return {
    sessionId: record.id,
    user: mapUser(record.user),
    expiresAt,
    renewed: shouldRenew,
  };
}

export async function revokeCurrentSession(sessionId: string): Promise<void> {
  await authRepository.revokeSessionById(prisma, sessionId, new Date());
}

export async function revokeAllSessions(userId: string): Promise<void> {
  await authRepository.revokeAllUserSessions(prisma, userId, new Date());
}
