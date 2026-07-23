import type { AuthenticatedUser } from "@mynsut/shared/types/auth";
import type { PermissionCode } from "@mynsut/shared/constants/permissions";
import type { RoleCode } from "@mynsut/shared/constants/roles";

export type SafeAuthenticatedUser = AuthenticatedUser;

export interface GoogleIdentity {
  subject: string;
  email: string;
  emailVerified: boolean;
  fullName: string;
  profileImageUrl?: string;
}
export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  scope: string;
  token_type: string;
}
export interface OAuthAttempt {
  state: string;
  nonce: string;
  codeVerifier: string;
  codeChallenge: string;
  authorizationUrl: string;
}
export interface AuthenticationResult {
  user: SafeAuthenticatedUser;
  rawSessionToken: string;
  sessionExpiresAt: Date;
}
export interface SessionMetadata {
  ipAddress?: string;
  userAgent?: string;
}
export interface ResolvedSession {
  sessionId: string;
  user: SafeAuthenticatedUser;
  expiresAt: Date;
  renewed: boolean;
}
export interface AuthContext {
  userId: string;
  sessionId: string;
  email: string;
  onboardingCompleted: boolean;
  roles: readonly RoleCode[];
  permissions: readonly PermissionCode[];
  studentId: string | null;
  classId: string | null;
}
