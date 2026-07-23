import type { OnboardingRequest } from "@mynsut/shared/types/student";
import { SECTIONS } from "@mynsut/shared/types/student";
import { z } from "zod";

export const onboardingSchema: z.ZodType<OnboardingRequest> = z.object({
  umsRollNumber: z.string().trim().min(1).max(30),
  section: z.enum(SECTIONS),
});
