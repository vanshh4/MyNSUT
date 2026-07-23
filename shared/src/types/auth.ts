import type { PermissionCode } from "../constants/permissions.js";
import type { RoleCode } from "../constants/roles.js";
import type {
  AuthErrorCode,
  AuthState,
  UserStatus,
} from "../constants/auth.js";
import type { StudentProfile } from "./student.js";
import type { EntityId, IsoDateString } from "./index.js";

/**
 * Safe user representation returned to authenticated frontend clients.
 * Provider subject IDs, OAuth tokens, session tokens, token hashes, IP
 * addresses, and User-Agent metadata are intentionally excluded.
 */
export interface AuthenticatedUser {
  id: EntityId;
  email: string;
  fullName: string;
  profileImageUrl: string | null;
  status: UserStatus;
  onboardingCompleted: boolean;
  roles: readonly RoleCode[];
  permissions: readonly PermissionCode[];
  student: StudentProfile | null;
}

export interface AuthSession {
  user: AuthenticatedUser;
  expiresAt: IsoDateString;
}

export interface AuthSessionResponse {
  user: AuthenticatedUser;
}

export interface LogoutResponse {
  revoked: true;
}

export interface AuthErrorDescriptor {
  code: AuthErrorCode;
  message: string;
}

export interface AuthClientState {
  status: AuthState;
  user: AuthenticatedUser | null;
  error: AuthErrorDescriptor | null;
}
