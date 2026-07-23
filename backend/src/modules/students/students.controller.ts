import type { OnboardingResponse } from "@mynsut/shared/types/student";
import type { Request, Response } from "express";

import { apiResponse } from "../../utils/apiResponse.js";
import { completeOnboarding, getOwnStudentProfile } from "./students.service.js";
import { onboardingSchema } from "./students.validation.js";

export async function getMe(request: Request, response: Response): Promise<void> {
  const profile = await getOwnStudentProfile(request.auth!.userId);
  response.status(200).json(apiResponse(profile, "Student profile retrieved."));
}
export async function onboardStudent(request: Request, response: Response): Promise<void> {
  const input = onboardingSchema.parse(request.body);
  const student = await completeOnboarding(request.auth!.userId, input);
  const result: OnboardingResponse = { student, onboardingCompleted: true };
  response.status(201).json(apiResponse(result, "Student onboarding completed successfully."));
}
