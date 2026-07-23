import type { BranchCode, BranchName } from "../constants/branches.js";
import type { EntityId, IsoDateString } from "./index.js";

export const SECTIONS = ["1", "2", "3"] as const;
export type SectionCode = (typeof SECTIONS)[number];

export function isSectionCode(value: unknown): value is SectionCode {
  return (
    typeof value === "string" &&
    SECTIONS.includes(value as SectionCode)
  );
}

export interface ParsedRollNumber {
  normalizedRollNumber: string;
  admissionYear: number;
  branchCode: BranchCode;
  rollNumber: string;
  graduationYear: number;
}

export interface AcademicClassSummary {
  id: EntityId;
  name: string;
  admissionYear: number;
  branchCode: BranchCode;
  branchName: BranchName;
  section: SectionCode;
  status: "ACTIVE" | "ARCHIVED";
}

export interface OnboardingRequest {
  umsRollNumber: string;
  section: SectionCode;
}

export interface StudentProfile {
  id: EntityId;
  userId: EntityId;
  classId: EntityId;
  umsRollNumber: string;
  admissionYear: number;
  branchCode: BranchCode;
  branchName: BranchName;
  rollNumber: string;
  section: SectionCode;
  graduationYear: number;
  currentSemester: number | null;
  academicClass?: AcademicClassSummary;
  createdAt?: IsoDateString;
  updatedAt?: IsoDateString;
}

export interface OnboardingResponse {
  student: StudentProfile;
  onboardingCompleted: true;
}
