import type { ProfileVisibility } from "../constants/profileVisibility.js";

export interface StudentPrivacySettings {
  id: string;
  studentId: string;
  bioVisibility: ProfileVisibility;
  socialLinksVisibility: ProfileVisibility;
  academicSummaryVisibility: ProfileVisibility;
  semesterResultsVisibility: ProfileVisibility;
  updatedAt: Date;
}

export interface UpdatePrivacyPayload {
  bioVisibility?: ProfileVisibility;
  socialLinksVisibility?: ProfileVisibility;
  academicSummaryVisibility?: ProfileVisibility;
  semesterResultsVisibility?: ProfileVisibility;
}
