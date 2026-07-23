/** Authentication values safe to expose to both application layers. */
export const AUTH_PROVIDER = "google" as const;
export const OFFICIAL_EMAIL_DOMAIN = "nsut.ac.in" as const;

export const USER_STATUSES = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  DELETED: "DELETED",
} as const;
export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];
export const USER_STATUS_VALUES = Object.freeze(Object.values(USER_STATUSES)) as readonly UserStatus[];
export function isUserStatus(value: unknown): value is UserStatus {
  return typeof value === "string" && USER_STATUS_VALUES.includes(value as UserStatus);
}

export const AUTH_STATES = {
  LOADING: "LOADING",
  AUTHENTICATED: "AUTHENTICATED",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  ERROR: "ERROR",
} as const;
export type AuthState = (typeof AUTH_STATES)[keyof typeof AUTH_STATES];

export const AUTH_ERROR_CODES = {
  AUTHENTICATION_REQUIRED: "AUTHENTICATION_REQUIRED",
  INVALID_SESSION: "INVALID_SESSION",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  ACCOUNT_SUSPENDED: "ACCOUNT_SUSPENDED",
  ACCOUNT_DELETED: "ACCOUNT_DELETED",
  ONBOARDING_REQUIRED: "ONBOARDING_REQUIRED",
  ONBOARDING_ALREADY_COMPLETED: "ONBOARDING_ALREADY_COMPLETED",
  INSUFFICIENT_ROLE: "INSUFFICIENT_ROLE",
  INSUFFICIENT_PERMISSION: "INSUFFICIENT_PERMISSION",
  INVALID_OAUTH_STATE: "INVALID_OAUTH_STATE",
  INVALID_OAUTH_RESPONSE: "INVALID_OAUTH_RESPONSE",
  GOOGLE_AUTHENTICATION_FAILED: "GOOGLE_AUTHENTICATION_FAILED",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  INVALID_EMAIL_DOMAIN: "INVALID_EMAIL_DOMAIN",
  GOOGLE_SUBJECT_CONFLICT: "GOOGLE_SUBJECT_CONFLICT",
  OAUTH_CONFIGURATION_ERROR: "OAUTH_CONFIGURATION_ERROR",
} as const;
export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];
export const AUTH_ERROR_CODE_VALUES = Object.freeze(Object.values(AUTH_ERROR_CODES)) as readonly AuthErrorCode[];
export function isAuthErrorCode(value: unknown): value is AuthErrorCode {
  return typeof value === "string" && AUTH_ERROR_CODE_VALUES.includes(value as AuthErrorCode);
}
