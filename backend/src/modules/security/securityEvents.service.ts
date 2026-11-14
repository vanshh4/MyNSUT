import type { Request } from "express";

import { redactLogData } from "../../utils/redactLogData.js";

export type SecurityEventType =
  | "AUTH_FAILURE"
  | "AUTH_SUCCESS"
  | "SESSION_REVOKED"
  | "CSRF_VIOLATION"
  | "RATE_LIMIT_EXCEEDED"
  | "PAYLOAD_TOO_LARGE"
  | "UNAUTHORIZED_ACCESS"
  | "SUSPICIOUS_REQUEST";

export interface SecurityEventPayload {
  type: SecurityEventType;
  req?: Request;
  userId?: string;
  details?: Record<string, unknown>;
  timestamp?: string;
}

export interface StructuredSecurityLog {
  timestamp: string;
  eventType: SecurityEventType;
  ip: string | undefined;
  method: string | undefined;
  path: string | undefined;
  requestId: string | undefined;
  userId: string | undefined;
  userAgent: string | undefined;
  details: Record<string, unknown>;
}

// In-memory buffer of recent security events for diagnostics / test assertions
const RECENT_EVENTS_MAX = 100;
const recentSecurityEvents: StructuredSecurityLog[] = [];

/**
 * Records a security event to structured telemetry while guaranteeing that all
 * sensitive keys, credentials, and PII are redacted.
 */
export function recordSecurityEvent(payload: SecurityEventPayload): StructuredSecurityLog {
  const req = payload.req;
  const rawRequestId = req?.headers["x-request-id"];
  const requestId = Array.isArray(rawRequestId) ? rawRequestId[0] : rawRequestId;
  const rawUserAgent = req?.headers["user-agent"];
  const userAgent = Array.isArray(rawUserAgent) ? rawUserAgent[0] : rawUserAgent;
  const ip = req?.ip;
  const method = req?.method;
  const path = req?.originalUrl || req?.url;
  const user = (req as unknown as { user?: { id?: string } })?.user;
  const resolvedUserId = payload.userId ?? user?.id;

  const rawDetails: Record<string, unknown> = {
    ...(payload.details ?? {}),
  };

  const sanitizedDetails = redactLogData(rawDetails);

  const logEntry: StructuredSecurityLog = {
    timestamp: payload.timestamp ?? new Date().toISOString(),
    eventType: payload.type,
    ip,
    method,
    path,
    requestId,
    userId: resolvedUserId,
    userAgent,
    details: sanitizedDetails,
  };

  // Push to recent events circular buffer
  recentSecurityEvents.push(logEntry);
  if (recentSecurityEvents.length > RECENT_EVENTS_MAX) {
    recentSecurityEvents.shift();
  }

  // Structured logging
  const logMessage = `[SECURITY_EVENT] [${logEntry.eventType}] ${logEntry.method ?? ""} ${logEntry.path ?? ""} - IP: ${logEntry.ip ?? "unknown"}`;
  if (
    payload.type === "CSRF_VIOLATION" ||
    payload.type === "UNAUTHORIZED_ACCESS" ||
    payload.type === "PAYLOAD_TOO_LARGE"
  ) {
    console.warn(logMessage, JSON.stringify(sanitizedDetails));
  } else if (payload.type === "RATE_LIMIT_EXCEEDED" || payload.type === "AUTH_FAILURE") {
    console.warn(logMessage, JSON.stringify(sanitizedDetails));
  } else {
    console.info(logMessage, JSON.stringify(sanitizedDetails));
  }

  return logEntry;
}

/**
 * Retrieves recorded security events from the internal buffer (useful for test assertions).
 */
export function getRecentSecurityEvents(): readonly StructuredSecurityLog[] {
  return recentSecurityEvents;
}

/**
 * Clears recorded security events from the internal buffer.
 */
export function clearRecentSecurityEvents(): void {
  recentSecurityEvents.length = 0;
}
