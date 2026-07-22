export const BRANCHES = {
  UCS: "Computer Science & Engineering",
  UIT: "Information Technology",
  UIN: "Information Technology with Network Security",
  UBT: "Biotechnology",
  UEC: "Electronics and Communication",
  UCM: "Mathematics and Computing",
} as const;

export type BranchCode = keyof typeof BRANCHES;
export const BRANCH_CODES = Object.freeze(Object.keys(BRANCHES)) as readonly BranchCode[];

export function isBranchCode(value: string): value is BranchCode {
  return BRANCH_CODES.includes(value as BranchCode);
}
