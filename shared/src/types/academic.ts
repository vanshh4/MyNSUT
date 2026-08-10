import type { AcademicSemester, Grade, ResultStatus, RankType } from "../constants/academic.js";

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
}

export interface SubjectGrade {
  id: string;
  semesterResultId: string;
  subjectId: string;
  subject: Subject;
  grade: Grade;
}

export interface SemesterResult {
  id: string;
  studentAcademicSummaryId: string;
  semester: AcademicSemester;
  sgpa: number | null;
  cgpa: number | null;
  creditsEarned: number;
  totalCredits: number;
  status: ResultStatus;
  grades: SubjectGrade[];
}

export interface StudentRank {
  id: string;
  studentAcademicSummaryId: string;
  rankType: RankType;
  rank: number;
  batchSize: number;
}

export interface StudentAcademicSummary {
  id: string;
  studentId: string;
  currentCgpa: number | null;
  totalCreditsEarned: number;
  results: SemesterResult[];
  ranks: StudentRank[];
}
