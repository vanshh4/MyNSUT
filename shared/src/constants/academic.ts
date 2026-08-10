export const ACADEMIC_SEMESTER = {
  SEM_1: 1,
  SEM_2: 2,
  SEM_3: 3,
  SEM_4: 4,
  SEM_5: 5,
  SEM_6: 6,
  SEM_7: 7,
  SEM_8: 8,
} as const;

export type AcademicSemester = typeof ACADEMIC_SEMESTER[keyof typeof ACADEMIC_SEMESTER];

export const GRADE = {
  O: "O",
  A_PLUS: "A+",
  A: "A",
  B_PLUS: "B+",
  B: "B",
  C: "C",
  P: "P",
  F: "F",
} as const;

export type Grade = typeof GRADE[keyof typeof GRADE];

export const RESULT_STATUS = {
  PASS: "PASS",
  FAIL: "FAIL",
  WITHHELD: "WITHHELD",
} as const;

export type ResultStatus = typeof RESULT_STATUS[keyof typeof RESULT_STATUS];

export const RANK_TYPE = {
  CLASS: "CLASS",
  UNIVERSITY: "UNIVERSITY",
} as const;

export type RankType = typeof RANK_TYPE[keyof typeof RANK_TYPE];
