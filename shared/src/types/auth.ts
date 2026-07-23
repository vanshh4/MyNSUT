import type { AuthErrorCode, AuthState, UserStatus } from "../constants/auth.js";
import type { PermissionCode } from "../constants/permissions.js";
import type { RoleCode } from "../constants/roles.js";
import type { StudentProfile } from "./student.js";

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  profileImageUrl: string | null;
  status: UserStatus;
  onboardingCompleted: boolean;
  roles: readonly RoleCode[];
  permissions: readonly PermissionCode[];
  student: StudentProfile | null;
}
export interface AuthSession { user: AuthenticatedUser; expiresAt: string; }
export interface AuthSessionResponse { user: AuthenticatedUser; }
export interface LogoutResponse { revoked: true; }
export interface AuthErrorDescriptor { code: AuthErrorCode; message: string; }
export interface AuthClientState {
  status: AuthState;
  user: AuthenticatedUser | null;
  error: AuthErrorDescriptor | null;
}
