import { createHash, randomBytes } from "node:crypto";

import { isUserStatus } from "@mynsut/shared/constants/auth";
import { BRANCHES, isBranchCode } from "@mynsut/shared/constants/branches";
import { isPermissionCode } from "@mynsut/shared/constants/permissions";
import { isRoleCode } from "@mynsut/shared/constants/roles";
import type { AuthenticatedUser } from "@mynsut/shared/types/auth";
import { isSectionCode } from "@mynsut/shared/types/student";
import { UserStatus } from "@prisma/client";

import { authConfig } from "../../config/auth.js";
import { prisma } from "../../db/prisma.js";
import { accountDeleted, accountSuspended, invalidSession, sessionExpired }
  from "./auth.errors.js";
import * as authRepository from "./auth.repository.js";
import type { ResolvedSession, SessionMetadata } from "./auth.types.js";

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}
function createRawToken(): string { return randomBytes(48).toString("base64url"); }

type SessionRecord = NonNullable<Awaited<ReturnType<typeof authRepository.findSessionByTokenHash>>>;
function mapUser(record: SessionRecord["user"]): AuthenticatedUser {
  const roles = [
    ...new Set(record.globalRoles.map(({ role }) => role.code).filter(isRoleCode)),
  ];
  const permissions = [
    ...new Set(
      record.globalRoles
        .flatMap(({ role }) => role.permissions.map(({ permission }) => permission.code))
        .filter(isPermissionCode)
    ),
  ];
  if (!isUserStatus(record.status)) throw new Error("Invalid stored user status.");

  let student: AuthenticatedUser["student"] = null;
  if (record.student) {
    if (!isBranchCode(record.student.branchCode)) throw new Error("Invalid stored branch code.");
    if (!isSectionCode(record.student.section)) throw new Error("Invalid stored section code.");
    student = {
      id: record.student.id,
      userId: record.student.userId,
      classId: record.student.classId,
      umsRollNumber: record.student.umsRollNumber,
      admissionYear: record.student.admissionYear,
      branchCode: record.student.branchCode,
      branchName: BRANCHES[record.student.branchCode],
      rollNumber: record.student.rollNumber,
      section: record.student.section,
      graduationYear: record.student.graduationYear,
      currentSemester: record.student.currentSemester,
    };
  }

  return {
    id: record.id,
    email: record.email,
    fullName: record.fullName,
    profileImageUrl: record.profileImageUrl,
    status: record.status,
    onboardingCompleted: record.onboardingCompleted,
    roles,
    permissions,
    student,
  };
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
      await authRepository.revokeSessionsByIds(tx, active.slice(0, overflow).map(({ id }) => id), now);
    }
    return authRepository.createSession(tx, {
      userId, tokenHash, expiresAt,
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
  const renewed = record.expiresAt.getTime() - now.getTime() <= authConfig.session.refreshThresholdMs;
  let expiresAt = record.expiresAt;
  if (renewed) {
    expiresAt = new Date(now.getTime() + authConfig.session.durationMs);
    await authRepository.renewSession(prisma, record.id, expiresAt, now);
  }
  return { sessionId: record.id, user: mapUser(record.user), expiresAt, renewed };
}
export async function revokeCurrentSession(sessionId: string): Promise<void> {
  await authRepository.revokeSessionById(prisma, sessionId, new Date());
}
export async function revokeAllSessions(userId: string): Promise<void> {
  await authRepository.revokeAllUserSessions(prisma, userId, new Date());
}
