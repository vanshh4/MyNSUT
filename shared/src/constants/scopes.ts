export const SCOPES = {
  GLOBAL: "GLOBAL",
  CLASS: "CLASS",
  SOCIETY: "SOCIETY",
} as const;

export type ScopeCode = (typeof SCOPES)[keyof typeof SCOPES];

export const SCOPE_CODES = Object.freeze(Object.values(SCOPES)) as readonly ScopeCode[];

export function isScopeCode(value: unknown): value is ScopeCode {
  return typeof value === "string" && SCOPE_CODES.includes(value as ScopeCode);
}
