import { z } from "zod";

export const updateProfileSchema = z.object({
  bio: z.string().max(500, "Bio cannot exceed 500 characters").nullable().optional(),
  githubUrl: z.string().url("Must be a valid URL").nullable().optional(),
  linkedinUrl: z.string().url("Must be a valid URL").nullable().optional(),
}).strict();
