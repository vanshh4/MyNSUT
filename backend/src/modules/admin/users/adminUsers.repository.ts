import type { Prisma, PrismaClient } from "@prisma/client";
import { UserStatus } from "@prisma/client";
import type { UserSearchFilters } from "./adminUsers.types.js";

function buildWhereClause(filters: UserSearchFilters): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {};

  if (filters.q) {
    where.OR = [
      { fullName: { contains: filters.q, mode: "insensitive" } },
      { email: { contains: filters.q, mode: "insensitive" } },
      { student: { umsRollNumber: { contains: filters.q, mode: "insensitive" } } },
    ];
  }

  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status;
  } else if (!filters.status) {
    // Default: exclude DELETED
    where.status = { in: [UserStatus.ACTIVE, UserStatus.SUSPENDED] };
  }

  if (filters.branchCode || filters.admissionYear) {
    where.student = {};
    if (filters.branchCode) where.student.branchCode = filters.branchCode;
    if (filters.admissionYear) where.student.admissionYear = filters.admissionYear;
  }

  return where;
}

export async function searchUsers(
  client: PrismaClient,
  filters: UserSearchFilters,
  pagination: { page: number; limit: number }
) {
  const where = buildWhereClause(filters);

  const [data, total] = await Promise.all([
    client.user.findMany({
      where,
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      orderBy: { fullName: "asc" },
      include: {
        student: true,
        _count: {
          select: {
            globalRoles: { where: { revokedAt: null } },
            classRoles: { where: { revokedAt: null } },
            societyRoles: { where: { revokedAt: null } },
          }
        }
      }
    }),
    client.user.count({ where }),
  ]);

  return { data, total };
}

export function findUserById(client: PrismaClient, userId: string) {
  return client.user.findUnique({
    where: { id: userId },
    include: {
      student: true,
      _count: {
        select: {
          globalRoles: { where: { revokedAt: null } },
          classRoles: { where: { revokedAt: null } },
          societyRoles: { where: { revokedAt: null } },
        }
      }
    }
  });
}
