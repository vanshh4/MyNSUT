import { z } from "zod";

import { SECTIONS } from "../../constants/sections.js";

export const onboardingSchema = z.object({
  umsRollNumber: z.string().trim().min(1).max(30),
  section: z.enum(SECTIONS),
});

export type OnboardingRequest = z.infer<typeof onboardingSchema>;
