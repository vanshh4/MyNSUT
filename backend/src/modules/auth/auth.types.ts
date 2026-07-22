import type { PermissionCode } from "@mynsut/shared/constants/permissions";
import type { RoleCode } from "@mynsut/shared/constants/roles";
import type { UserStatus } from "@prisma/client";

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

export interface SafeStudentSummary {
  id: string;
  umsRollNumber: string;
  admissionYear: number;
  branchCode: string;
  section: string | null;
  graduationYear: number | null;
  classId: string | null;
}

export interface SafeAuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  profileImageUrl: string | null;
  status: UserStatus;
  onboardingCompleted: boolean;
  roles: RoleCode[];
  permissions: PermissionCode[];
  student: SafeStudentSummary | null;
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
  roles: RoleCode[];
  permissions: PermissionCode[];
  studentId: string | null;
  classId: string | null;
}
