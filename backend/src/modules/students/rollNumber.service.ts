import type { ParsedRollNumber } from "@mynsut/shared/types/student";

import { BRANCHES, isBranchCode } from "../../constants/branches.js";
import { studentErrors } from "./students.errors.js";

const ROLL_NUMBER_PATTERN = /^(\d{4})([A-Z]+)(\d+)$/;
const MINIMUM_ADMISSION_YEAR = 2020;

export function parseUmsRollNumber(
  input: string,
  currentYear = new Date().getUTCFullYear()
): ParsedRollNumber {
  const normalizedRollNumber = input.trim().toUpperCase();
  const match = ROLL_NUMBER_PATTERN.exec(normalizedRollNumber);
  if (!match) throw studentErrors.invalidRollNumber();

  const [, yearPart, branchPart, numericPart] = match;
  if (!yearPart || !branchPart || !numericPart) throw studentErrors.invalidRollNumber();
  const admissionYear = Number(yearPart);
  if (
    !Number.isInteger(admissionYear) ||
    admissionYear < MINIMUM_ADMISSION_YEAR ||
    admissionYear > currentYear
  )
    throw studentErrors.invalidAdmissionYear();
  if (!isBranchCode(branchPart)) throw studentErrors.unsupportedBranch();

  return {
    normalizedRollNumber,
    admissionYear,
    branchCode: branchPart,
    rollNumber: numericPart,
    graduationYear: admissionYear + 4,
  };
}
export function getBranchName(branchCode: keyof typeof BRANCHES): string {
  return BRANCHES[branchCode];
}
