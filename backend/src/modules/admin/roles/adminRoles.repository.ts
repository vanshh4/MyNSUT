import type { Prisma, PrismaClient } from "@prisma/client";

export type DatabaseClient = PrismaClient | Prisma.TransactionClient;

export async function findAllRolesWithCounts(client: DatabaseClient) {
  const roles = await client.role.findMany({
    include: {
      _count: {
        select: {
          users: { where: { revokedAt: null } },
          classRoles: { where: { revokedAt: null } },
          societyRoles: { where: { revokedAt: null } },
        }
      }
    }
  });

  return roles.map(role => ({
    ...role,
    activeAssignmentsCount: role._count.users + role._count.classRoles + role._count.societyRoles
  }));
}

export async function findUserAssignments(client: DatabaseClient, userId: string) {
  const [global, classRoles, societyRoles] = await Promise.all([
    client.userGlobalRole.findMany({ where: { userId, revokedAt: null }, include: { role: true } }),
    client.classRole.findMany({ where: { userId, revokedAt: null }, include: { role: true } }),
    client.societyRole.findMany({ where: { userId, revokedAt: null }, include: { role: true } }),
  ]);
  return { global, classRoles, societyRoles };
}

export function findActiveGlobalAssignment(client: DatabaseClient, userId: string, roleId: string) {
  return client.userGlobalRole.findUnique({
    where: { userId_roleId: { userId, roleId } },
  }).then(res => res?.revokedAt ? null : res);
}

export function findActiveClassAssignment(client: DatabaseClient, userId: string, roleId: string, classId: string) {
  return client.classRole.findFirst({
    where: { userId, roleId, classId, revokedAt: null },
  });
}

export function findActiveSocietyAssignment(client: DatabaseClient, userId: string, roleId: string, societyId: string) {
  return client.societyRole.findFirst({
    where: { userId, roleId, societyId, revokedAt: null },
  });
}
