export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ValueOf<T> = T[keyof T];
export type EntityId = string;
export type IsoDateString = string;

export type {
  ApiErrorDetails,
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
  HealthData,
  JsonObject,
  JsonPrimitive,
  JsonValue,
  PaginatedResponse,
  PaginationMeta,
  PaginationQuery,
} from "./api.js";

export { PERMISSIONS, PERMISSION_CODES, isPermissionCode } from "../constants/permissions.js";
export type { PermissionCode } from "../constants/permissions.js";

export { ROLES, ROLE_CODES, isRoleCode } from "../constants/roles.js";
export type { RoleCode } from "../constants/roles.js";
