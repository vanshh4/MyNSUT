import type { Prisma, PrismaClient } from "@prisma/client";
import type { ScopeCode } from "@mynsut/shared/constants/scopes";
import { SCOPES } from "@mynsut/shared/constants/scopes";

export type DatabaseClient = PrismaClient | Prisma.TransactionClient;

export function findActiveGlobalRoles(client: DatabaseClient, userId: string) {
  return client.userGlobalRole.findMany({
    where: { userId, revokedAt: null },
    include: {
      role: {
        include: { permissions: { include: { permission: true } } },
      },
    },
  });
}

export function findActiveClassRoles(client: DatabaseClient, userId: string, classId?: string) {
  return client.classRole.findMany({
    where: { userId, revokedAt: null, ...(classId ? { classId } : {}) },
    include: {
      role: {
        include: { permissions: { include: { permission: true } } },
      },
    },
  });
}

export function findActiveSocietyRoles(client: DatabaseClient, userId: string, societyId?: string) {
  return client.societyRole.findMany({
    where: { userId, revokedAt: null, ...(societyId ? { societyId } : {}) },
    include: {
      role: {
        include: { permissions: { include: { permission: true } } },
      },
    },
  });
}

export function findRoleByCode(client: DatabaseClient, code: string) {
  return client.role.findUnique({
    where: { code },
  });
}

export function findAllRoles(client: DatabaseClient) {
  return client.role.findMany();
}

export function assignGlobalRole(client: DatabaseClient, data: { userId: string; roleId: string; assignedBy?: string }) {
  return client.userGlobalRole.create({ data });
}

export function revokeGlobalRole(client: DatabaseClient, userId: string, roleId: string, revokedBy: string, now: Date) {
  return client.userGlobalRole.updateMany({
    where: { userId, roleId, revokedAt: null },
    data: { revokedAt: now, revokedBy },
  });
}

export function assignClassRole(client: DatabaseClient, data: { userId: string; roleId: string; classId: string; assignedBy?: string }) {
  return client.classRole.create({ data });
}

export function revokeClassRole(client: DatabaseClient, id: string, revokedBy: string, now: Date) {
  return client.classRole.updateMany({
    where: { id, revokedAt: null },
    data: { revokedAt: now, revokedBy },
  });
}

export function assignSocietyRole(client: DatabaseClient, data: { userId: string; roleId: string; societyId: string; assignedBy?: string }) {
  return client.societyRole.create({ data });
}

export function revokeSocietyRole(client: DatabaseClient, id: string, revokedBy: string, now: Date) {
  return client.societyRole.updateMany({
    where: { id, revokedAt: null },
    data: { revokedAt: now, revokedBy },
  });
}

export async function findActiveAssignmentById(
  client: DatabaseClient,
  scope: ScopeCode,
  id: string,
  userId?: string,
  roleId?: string
) {
  if (scope === SCOPES.GLOBAL) {
    if (!userId || !roleId) throw new Error("userId and roleId required for global scope assignment lookup.");
    const record = await client.userGlobalRole.findUnique({
      where: { userId_roleId: { userId, roleId } },
      include: { role: true },
    });
    return record?.revokedAt ? null : record;
  } else if (scope === SCOPES.CLASS) {
    const record = await client.classRole.findUnique({
      where: { id },
      include: { role: true },
    });
    return record?.revokedAt ? null : record;
  } else if (scope === SCOPES.SOCIETY) {
    const record = await client.societyRole.findUnique({
      where: { id },
      include: { role: true },
    });
    return record?.revokedAt ? null : record;
  }
  return null;
}
