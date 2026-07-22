import type { BranchCode } from "../../constants/branches.js";
import type { SectionCode } from "../../constants/sections.js";

export interface ParsedRollNumber {
  normalizedRollNumber: string;
  admissionYear: number;
  branchCode: BranchCode;
  rollNumber: string;
  graduationYear: number;
}

export interface OnboardingInput {
  umsRollNumber: string;
  section: SectionCode;
}

export interface StudentProfile {
  id: string;
  userId: string;
  umsRollNumber: string;
  admissionYear: number;
  branchCode: BranchCode;
  branchName: string;
  rollNumber: string;
  section: SectionCode;
  graduationYear: number;
  currentSemester: null;
  classId: string;
}
