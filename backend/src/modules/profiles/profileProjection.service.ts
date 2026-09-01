import type { OwnProfileProjection, PublicProfileProjection, ExtendedStudentProfile } from "@mynsut/shared/types/profile";
import type { StudentAcademicSummary } from "@mynsut/shared/types/academic";
import { PROFILE_VISIBILITY } from "@mynsut/shared/constants/profileVisibility";

function extractRoles(user: any) {
  if (!user) return undefined;
  
  const isClassCR = user.classRoles && user.classRoles.length > 0;
  const societyPORs: { societyName: string; positionName: string }[] = [];
  
  if (user.societyMemberships) {
    for (const membership of user.societyMemberships) {
      if (membership.positions) {
        for (const posAssign of membership.positions) {
          societyPORs.push({
            societyName: membership.society.name,
            positionName: posAssign.position.title,
          });
        }
      }
    }
  }

  if (!isClassCR && societyPORs.length === 0) return undefined;

  return {
    isClassCR,
    societyPORs,
  };
}

export function mapToOwnProfile(student: any): OwnProfileProjection {
  // Map Prisma models to the exact Shared type
  if (!student.profile) throw new Error("Profile missing");
  const extendedProfile: ExtendedStudentProfile = {
    id: student.profile.id,
    studentId: student.profile.studentId,
    student: student, // raw student details
    bio: student.profile.bio,
    githubUrl: student.profile.githubUrl,
    linkedinUrl: student.profile.linkedinUrl,
    privacySettings: student.privacySettings,
    academicSummary: student.academicSummary,
    updatedAt: student.profile.updatedAt,
  };

  const roles = extractRoles(student.user);
  if (roles) {
    extendedProfile.roles = roles;
  }

  return extendedProfile;
}

export function mapToPublicProfile(student: any): PublicProfileProjection {
  const privacy = student.privacySettings;
  const profile = student.profile;
  
  const isBioVisible = privacy?.bioVisibility === PROFILE_VISIBILITY.PUBLIC || privacy?.bioVisibility === PROFILE_VISIBILITY.PLATFORM_ONLY;
  const isSocialVisible = privacy?.socialLinksVisibility === PROFILE_VISIBILITY.PUBLIC || privacy?.socialLinksVisibility === PROFILE_VISIBILITY.PLATFORM_ONLY;
  const isAcademicVisible = privacy?.academicSummaryVisibility === PROFILE_VISIBILITY.PUBLIC || privacy?.academicSummaryVisibility === PROFILE_VISIBILITY.PLATFORM_ONLY;
  // PLATFORM_ONLY is visible because this endpoint is authenticated.

  const publicProfile = {
    id: profile?.id || "unknown",
    studentId: student.id,
    name: student.user?.fullName || "Student",
    rollNumber: student.rollNumber,
    branch: student.branchCode,
    admissionYear: student.admissionYear,
    bio: isBioVisible && profile ? profile.bio : undefined,
    githubUrl: isSocialVisible && profile ? profile.githubUrl : undefined,
    linkedinUrl: isSocialVisible && profile ? profile.linkedinUrl : undefined,
    academicSummary: (isAcademicVisible && student.academicSummary) ? student.academicSummary : undefined,
  } as PublicProfileProjection;

  const roles = extractRoles(student.user);
  if (roles) {
    publicProfile.roles = roles;
  }

  return publicProfile;
}
