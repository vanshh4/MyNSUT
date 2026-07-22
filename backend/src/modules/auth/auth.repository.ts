import type { Prisma, PrismaClient } from "@prisma/client";

import type { GoogleIdentity } from "./auth.types.js";

export type DatabaseClient = PrismaClient | Prisma.TransactionClient;

export function findUserByEmail(client: DatabaseClient, email: string) {
  return client.user.findUnique({
    where: { email },
  });
}

export function findUserByGoogleSubject(client: DatabaseClient, googleSubject: string) {
  return client.user.findUnique({
    where: { googleSubject },
  });
}

export function createGoogleUser(client: DatabaseClient, identity: GoogleIdentity) {
  return client.user.create({
    data: {
      email: identity.email,
      emailVerified: identity.emailVerified,
      googleSubject: identity.subject,
      fullName: identity.fullName,
      onboardingCompleted: false,
      ...(identity.profileImageUrl ? { profileImageUrl: identity.profileImageUrl } : {}),
    },
  });
}

export function linkGoogleIdentity(
  client: DatabaseClient,
  userId: string,
  identity: GoogleIdentity
) {
  return client.user.update({
    where: { id: userId },
    data: {
      googleSubject: identity.subject,
      emailVerified: true,
      fullName: identity.fullName,
      ...(identity.profileImageUrl ? { profileImageUrl: identity.profileImageUrl } : {}),
    },
  });
}

export function updateGoogleProfile(
  client: DatabaseClient,
  userId: string,
  identity: GoogleIdentity
) {
  return client.user.update({
    where: { id: userId },
    data: {
      emailVerified: true,
      fullName: identity.fullName,
      ...(identity.profileImageUrl ? { profileImageUrl: identity.profileImageUrl } : {}),
    },
  });
}

export function findSessionByTokenHash(client: DatabaseClient, tokenHash: string) {
  return client.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        include: {
          student: true,
          globalRoles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export function createSession(
  client: DatabaseClient,
  data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  }
) {
  return client.session.create({
    data,
  });
}

export function findActiveSessions(client: DatabaseClient, userId: string, now: Date) {
  return client.session.findMany({
    where: {
      userId,
      revokedAt: null,
      expiresAt: {
        gt: now,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
    },
  });
}

export function revokeSessionsByIds(client: DatabaseClient, sessionIds: string[], revokedAt: Date) {
  if (sessionIds.length === 0) {
    return Promise.resolve({ count: 0 });
  }

  return client.session.updateMany({
    where: {
      id: {
        in: sessionIds,
      },
      revokedAt: null,
    },
    data: {
      revokedAt,
    },
  });
}

export function revokeSessionById(client: DatabaseClient, sessionId: string, revokedAt: Date) {
  return client.session.updateMany({
    where: {
      id: sessionId,
      revokedAt: null,
    },
    data: {
      revokedAt,
    },
  });
}

export function revokeAllUserSessions(client: DatabaseClient, userId: string, revokedAt: Date) {
  return client.session.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt,
    },
  });
}

export function renewSession(
  client: DatabaseClient,
  sessionId: string,
  expiresAt: Date,
  lastUsedAt: Date
) {
  return client.session.update({
    where: {
      id: sessionId,
    },
    data: {
      expiresAt,
      lastUsedAt,
    },
  });
}
