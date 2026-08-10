import type { Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.js";
import { getOwnPrivacySettings, updateOwnPrivacySettings } from "./privacy.service.js";
import { updatePrivacySchema } from "./privacy.validation.js";

export async function getPrivacySettings(request: Request, response: Response): Promise<void> {
  const settings = await getOwnPrivacySettings(request.auth!.userId);
  response.status(200).json(apiResponse(settings, "Privacy settings retrieved."));
}

export async function updatePrivacySettings(request: Request, response: Response): Promise<void> {
  const parsed = updatePrivacySchema.parse(request.body);
  const input = JSON.parse(JSON.stringify(parsed));
  const settings = await updateOwnPrivacySettings(request.auth!.userId, input);
  response.status(200).json(apiResponse(settings, "Privacy settings updated successfully."));
}
