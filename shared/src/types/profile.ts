import type { StudentPrivacySettings } from "./privacy.js";
import type { StudentAcademicSummary } from "./academic.js";
import type { StudentProfile as CoreStudentProfile } from "./student.js";

export interface ExtendedStudentProfile {
  id: string;
  studentId: string;
  student: CoreStudentProfile;
  bio: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  privacySettings: StudentPrivacySettings;
  academicSummary?: StudentAcademicSummary;
  roles?: {
    isClassCR: boolean;
    societyPORs: { societyName: string; positionName: string }[];
  };
  updatedAt: Date;
}

export interface UpdateProfilePayload {
  bio?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
}

// Projection for the owner (sees everything)
export interface OwnProfileProjection extends ExtendedStudentProfile {}

// Projection for peers (filtered by privacy settings)
export interface PublicProfileProjection {
  id: string;
  studentId: string;
  name: string; // From Student
  rollNumber: string; // From Student
  branch: string; // From Student
  admissionYear: number; // From Student
  bio?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  academicSummary?: StudentAcademicSummary; // Only if visible
  roles?: {
    isClassCR: boolean;
    societyPORs: { societyName: string; positionName: string }[];
  };
}
