import type { UserSearchFilters, SafeAdminUser, SafeAdminUserDetail } from "./adminUsers.types.js";
import { prisma } from "../../../db/prisma.js";
import * as adminUsersRepository from "./adminUsers.repository.js";
import { ApiError } from "../../../utils/apiError.js";

function mapToSafeAdminUser(user: any): SafeAdminUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    profileImageUrl: user.profileImageUrl,
    status: user.status,
    onboardingCompleted: user.onboardingCompleted,
    student: user.student ? {
      umsRollNumber: user.student.umsRollNumber,
      branchCode: user.student.branchCode,
      admissionYear: user.student.admissionYear,
      section: user.student.section,
    } : null,
    rolesCount: user._count.globalRoles + user._count.classRoles + user._count.societyRoles,
  };
}

export async function searchUsers(filters: UserSearchFilters, pagination: { page: number; limit: number }) {
  const { data, total } = await adminUsersRepository.searchUsers(prisma, filters, pagination);
  
  return {
    data: data.map(mapToSafeAdminUser),
    meta: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    }
  };
}

export async function getUserDetail(userId: string): Promise<SafeAdminUserDetail> {
  const user = await adminUsersRepository.findUserById(prisma, userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return {
    ...mapToSafeAdminUser(user),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    emailVerified: user.emailVerified,
  };
}
