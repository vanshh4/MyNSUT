import { z } from "zod";
import { PROFILE_VISIBILITY } from "@mynsut/shared/constants/profileVisibility";

const visibilitySchema = z.nativeEnum(PROFILE_VISIBILITY);

export const updatePrivacySchema = z.object({
  bioVisibility: visibilitySchema.optional(),
  socialLinksVisibility: visibilitySchema.optional(),
  academicSummaryVisibility: visibilitySchema.optional(),
  semesterResultsVisibility: visibilitySchema.optional(),
}).strict();
