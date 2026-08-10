import type { Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.js";
import { getStudentOwnProfile, getStudentPeerProfile, updateStudentOwnProfile } from "./profiles.service.js";
import { updateProfileSchema } from "./profiles.validation.js";

export async function getOwnProfile(request: Request, response: Response): Promise<void> {
  const profile = await getStudentOwnProfile(request.auth!.userId);
  response.status(200).json(apiResponse(profile, "Profile retrieved successfully."));
}

export async function getPeerProfile(request: Request, response: Response): Promise<void> {
  const rollNumber = request.params.rollNumber as string;
  const profile = await getStudentPeerProfile(request.auth!.userId, rollNumber);
  response.status(200).json(apiResponse(profile, "Peer profile retrieved successfully."));
}

export async function updateOwnProfile(request: Request, response: Response): Promise<void> {
  const parsed = updateProfileSchema.parse(request.body);
  // Strip undefined to satisfy exactOptionalPropertyTypes
  const input = JSON.parse(JSON.stringify(parsed));
  const profile = await updateStudentOwnProfile(request.auth!.userId, input);
  response.status(200).json(apiResponse(profile, "Profile updated successfully."));
}
