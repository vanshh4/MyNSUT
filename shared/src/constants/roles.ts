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
