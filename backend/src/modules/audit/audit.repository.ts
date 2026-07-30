import type { Prisma, PrismaClient } from "@prisma/client";
import type { AuditFilters } from "@mynsut/shared/types/audit";

export type DatabaseClient = PrismaClient | Prisma.TransactionClient;

export interface CreateAuditLogData {
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  targetUserId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

export function createAuditLog(client: DatabaseClient, data: CreateAuditLogData) {
  const { metadata, ...rest } = data;
  return client.auditLog.create({
    data: {
      ...rest,
      metadata: metadata ? (metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
    },
  });
}

export async function findAuditLogs(
  client: PrismaClient,
  filters: AuditFilters,
  pagination: { page: number; limit: number }
) {
  const where: Prisma.AuditLogWhereInput = {};
  
  if (filters.actorId) where.actorId = filters.actorId;
  if (filters.action) where.action = filters.action;
  if (filters.targetType) where.targetType = filters.targetType;
  if (filters.targetUserId) where.targetUserId = filters.targetUserId;
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
    if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
  }

  const [data, total] = await Promise.all([
    client.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      include: {
        actor: { select: { fullName: true } },
        targetUser: { select: { fullName: true } },
      },
    }),
    client.auditLog.count({ where }),
  ]);

  return { data, total };
}

export function findAuditLogById(client: PrismaClient, id: string) {
  return client.auditLog.findUnique({
    where: { id },
    include: {
      actor: { select: { fullName: true } },
      targetUser: { select: { fullName: true } },
    },
  });
}
