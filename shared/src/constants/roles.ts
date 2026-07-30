import type { ScopeCode } from "./scopes.js";
import { SCOPES } from "./scopes.js";

export const ROLE_DEFINITIONS = {
  SUPER_ADMIN: { code: "SUPER_ADMIN", name: "Super Admin", scope: SCOPES.GLOBAL, description: "Global administrator of the platform." },
  STUDENT: { code: "STUDENT", name: "Student", scope: SCOPES.GLOBAL, description: "Default role assigned to every verified NSUT student." },
  CLASS_CR: { code: "CLASS_CR", name: "Class Representative", scope: SCOPES.CLASS, description: "Class representative for a specific class." },
  SOCIETY_PRESIDENT: { code: "SOCIETY_PRESIDENT", name: "Society President", scope: SCOPES.SOCIETY, description: "Top-level society manager for a specific society." },
  SOCIETY_VICE_PRESIDENT: { code: "SOCIETY_VICE_PRESIDENT", name: "Society Vice President", scope: SCOPES.SOCIETY, description: "Assistant society manager for a specific society." },
  SOCIETY_MEMBER: { code: "SOCIETY_MEMBER", name: "Society Member", scope: SCOPES.SOCIETY, description: "Member of a society." },
} as const satisfies Record<string, { code: string; name: string; scope: ScopeCode; description: string }>;

/**
 * Stable role identifiers used by the frontend, backend, database seed,
 * and authorization policies. Do not change persisted values casually.
 */
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  STUDENT: "STUDENT",
  CLASS_CR: "CLASS_CR",
  SOCIETY_PRESIDENT: "SOCIETY_PRESIDENT",
  SOCIETY_VICE_PRESIDENT: "SOCIETY_VICE_PRESIDENT",
  SOCIETY_MEMBER: "SOCIETY_MEMBER",
} as const;

export type RoleCode = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_CODES = Object.freeze(Object.values(ROLES)) as readonly RoleCode[];

export function isRoleCode(value: unknown): value is RoleCode {
  return typeof value === "string" && ROLE_CODES.includes(value as RoleCode);
}
