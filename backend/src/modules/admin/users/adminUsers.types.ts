import type { UserStatus } from "@prisma/client";

export interface UserSearchFilters {
  q?: string;
  status?: UserStatus | "ALL";
  branchCode?: string;
  admissionYear?: number;
}

export interface SafeAdminUser {
  id: string;
  email: string;
  fullName: string;
  profileImageUrl: string | null;
  status: UserStatus;
  onboardingCompleted: boolean;
  student: {
    umsRollNumber: string;
    branchCode: string;
    admissionYear: number;
    section: string;
  } | null;
  rolesCount: number;
}

export interface SafeAdminUserDetail extends SafeAdminUser {
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
}
