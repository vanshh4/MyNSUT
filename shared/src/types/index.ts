export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ValueOf<T> = T[keyof T];
export type EntityId = string;
export type IsoDateString = string;

export { AUTH_ERROR_CODES, AUTH_ERROR_CODE_VALUES, AUTH_PROVIDER, AUTH_STATES,
  OFFICIAL_EMAIL_DOMAIN, USER_STATUSES, USER_STATUS_VALUES,
  isAuthErrorCode, isUserStatus } from "../constants/auth.js";
export type { AuthErrorCode, AuthState, UserStatus } from "../constants/auth.js";
export { BRANCHES, BRANCH_CODES, BRANCH_OPTIONS, getBranchName, isBranchCode }
  from "../constants/branches.js";
export type { BranchCode, BranchDefinition, BranchName } from "../constants/branches.js";
export { PERMISSIONS, PERMISSION_CODES, isPermissionCode } from "../constants/permissions.js";
export type { PermissionCode } from "../constants/permissions.js";
export { SCOPES, SCOPE_CODES, isScopeCode } from "../constants/scopes.js";
export type { ScopeCode } from "../constants/scopes.js";
export { ROLES, ROLE_DEFINITIONS, ROLE_CODES, isRoleCode } from "../constants/roles.js";
export type { RoleCode } from "../constants/roles.js";

export type { ApiErrorDetails, ApiErrorResponse, ApiResponse, ApiSuccessResponse,
  HealthData, JsonObject, JsonPrimitive, JsonValue, PaginatedResponse,
  PaginationMeta, PaginationQuery } from "./api.js";
export type { AuthClientState, AuthenticatedUser, AuthErrorDescriptor,
  AuthSession, AuthSessionResponse, LogoutResponse } from "./auth.js";
export { ACADEMIC_CLASS_STATUSES, SECTIONS, isSectionCode } from "./student.js";
export type { AcademicClassStatus, AcademicClassSummary, OnboardingRequest,
  OnboardingResponse, ParsedRollNumber, SectionCode, StudentProfile } from "./student.js";
export type { AuthorizationSummary, ScopedRoleAssignment, RoleAssignmentPayload, RoleAssignmentResponse, RoleRevocationPayload, SafeRoleAssignment, UserRolesSummary } from "./rbac.js";
export type { SafeAuditEntry, AuditFilters, PaginatedAuditResponse } from "./audit.js";
