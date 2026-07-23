import { BRANCHES, isBranchCode, type BranchCode } from "@mynsut/shared/constants/branches";
import {
  SECTIONS,
  type OnboardingRequest,
  type ParsedRollNumber,
} from "@mynsut/shared/types/student";
import { z } from "zod";

const MINIMUM_ADMISSION_YEAR = 2020;
const ROLL_NUMBER_PATTERN = /^(\d{4})([A-Z]+)(\d+)$/;

export const onboardingFormSchema: z.ZodType<OnboardingRequest> = z.object({
  umsRollNumber: z.string().trim().min(1, "Enter your UMS roll number.").max(30),
  section: z.enum(SECTIONS, { error: "Select a valid section." }),
});

export function previewRollNumber(
  input: string,
  currentYear = new Date().getFullYear()
): ParsedRollNumber | null {
  const normalizedRollNumber = input.trim().toUpperCase();
  const match = ROLL_NUMBER_PATTERN.exec(normalizedRollNumber);

  if (!match) return null;

  const [, yearPart, branchPart, rollNumber] = match;
  if (!yearPart || !branchPart || !rollNumber || !isBranchCode(branchPart)) return null;

  const admissionYear = Number(yearPart);
  if (admissionYear < MINIMUM_ADMISSION_YEAR || admissionYear > currentYear) return null;

  return {
    normalizedRollNumber,
    admissionYear,
    branchCode: branchPart as BranchCode,
    rollNumber,
    graduationYear: admissionYear + 4,
  };
}

export function branchLabel(branchCode: BranchCode): string {
  return BRANCHES[branchCode];
}
