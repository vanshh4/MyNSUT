import type { SafeAuditEntry, AuditFilters, PaginatedAuditResponse } from "@mynsut/shared/types/audit";
import * as auditRepository from "./audit.repository.js";
import { prisma } from "../../db/prisma.js";
import type { Prisma } from "@prisma/client";

// Metadata sanitization keys: strip sensitive fields from being logged
const SENSITIVE_KEYS = new Set([
  "cookies",
  "authorization",
  "oauthstate",
  "pkceverifier",
  "nonce",
  "sessiontoken",
  "tokenhash",
  "googlesubject",
  "refreshtoken",
  "providerid",
]);

function sanitizeMetadata(metadata?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!metadata) return undefined;
  
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase().replace(/[^a-z]/g, ""))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeMetadata(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function mapToSafeEntry(record: any): SafeAuditEntry {
  const result: any = {
    id: record.id,
    actorId: record.actorId,
    actorName: record.actor?.fullName || "Unknown Actor",
    action: record.action,
    targetType: record.targetType,
    targetId: record.targetId,
    createdAt: record.createdAt.toISOString(),
  };
  if (record.targetUserId) result.targetUserId = record.targetUserId;
  if (record.targetUser?.fullName) result.targetUserName = record.targetUser.fullName;
  if (record.metadata) result.metadata = record.metadata;
  if (record.ipAddress) result.ipAddress = record.ipAddress;
  return result as SafeAuditEntry;
}

export async function logAction(
  tx: Prisma.TransactionClient,
  actorId: string,
  action: string,
  targetType: string,
  targetId: string,
  targetUserId?: string,
  metadata?: Record<string, unknown>,
  ipAddress?: string
): Promise<void> {
  const sanitizedMetadata = sanitizeMetadata(metadata);
  const data: any = {
    actorId,
    action,
    targetType,
    targetId,
  };
  if (targetUserId) data.targetUserId = targetUserId;
  if (sanitizedMetadata) data.metadata = sanitizedMetadata;
  if (ipAddress) data.ipAddress = ipAddress;

  await auditRepository.createAuditLog(tx, data);
}

export async function getAuditLogs(filters: AuditFilters, pagination: { page: number; limit: number }): Promise<PaginatedAuditResponse> {
  const { data, total } = await auditRepository.findAuditLogs(prisma, filters, pagination);
  return {
    data: data.map(mapToSafeEntry),
    meta: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
}

export async function getAuditLogById(id: string): Promise<SafeAuditEntry | null> {
  const record = await auditRepository.findAuditLogById(prisma, id);
  if (!record) return null;
  return mapToSafeEntry(record);
}
