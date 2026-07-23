import type { BranchCode, BranchName } from "../constants/branches.js";

export type EntityId = string;
export type IsoDateString = string;

export const SECTIONS = ["1", "2", "3"] as const;
export type SectionCode = (typeof SECTIONS)[number];
export function isSectionCode(value: unknown): value is SectionCode {
  return typeof value === "string" && SECTIONS.includes(value as SectionCode);
}

export const ACADEMIC_CLASS_STATUSES = { ACTIVE: "ACTIVE", ARCHIVED: "ARCHIVED" } as const;
export type AcademicClassStatus =
  (typeof ACADEMIC_CLASS_STATUSES)[keyof typeof ACADEMIC_CLASS_STATUSES];

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
  status: AcademicClassStatus;
}

export interface OnboardingRequest { umsRollNumber: string; section: SectionCode; }

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
