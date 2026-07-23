/**
 * Undergraduate branch codes currently supported by MyNSUT onboarding.
 * Add future branch codes here so the frontend and backend remain aligned.
 */
export const BRANCHES = {
  UCS: "Computer Science & Engineering",
  UIT: "Information Technology",
  UIN: "Information Technology with Network Security",
  UBT: "Biotechnology",
  UEC: "Electronics and Communication",
  UCM: "Mathematics and Computing",
} as const;

export type BranchCode = keyof typeof BRANCHES;
export type BranchName = (typeof BRANCHES)[BranchCode];

export interface BranchDefinition {
  code: BranchCode;
  name: BranchName;
}

export const BRANCH_CODES = Object.freeze(
  Object.keys(BRANCHES)
) as readonly BranchCode[];

export const BRANCH_OPTIONS = Object.freeze(
  BRANCH_CODES.map((code) => ({
    code,
    name: BRANCHES[code],
  }))
) as readonly BranchDefinition[];

export function isBranchCode(value: unknown): value is BranchCode {
  return (
    typeof value === "string" &&
    BRANCH_CODES.includes(value as BranchCode)
  );
}

export function getBranchName(code: BranchCode): BranchName {
  return BRANCHES[code];
}
