import type { Request, Response } from "express";
import { zParse } from "../../validations/zod.js";
import * as announcementsService from "./classAnnouncements.service.js";
import { createAnnouncementSchema, updateAnnouncementSchema } from "./classAnnouncements.validation.js";
import { apiResponse } from "../../utils/apiResponse.js";

export async function getAnnouncements(req: Request, res: Response) {
  const { classId } = req.params;
  const data = await announcementsService.getClassAnnouncements(classId);
  res.status(200).json(apiResponse(data));
}

export async function createAnnouncement(req: Request, res: Response) {
  const { classId } = req.params;
  const payload = await zParse(createAnnouncementSchema, req.body);
  const actorId = req.user!.id;
  const actorIp = req.ip;

  const data = await announcementsService.createAnnouncement(classId, actorId, payload, actorIp);
  res.status(201).json(apiResponse(data, "Announcement created successfully."));
}

export async function updateAnnouncement(req: Request, res: Response) {
  const { announcementId } = req.params;
  const payload = await zParse(updateAnnouncementSchema, req.body);
  const actorId = req.user!.id;
  const actorIp = req.ip;

  const data = await announcementsService.updateAnnouncement(announcementId, actorId, payload, actorIp);
  res.status(200).json(apiResponse(data, "Announcement updated successfully."));
}

export async function deleteAnnouncement(req: Request, res: Response) {
  const { announcementId } = req.params;
  const actorId = req.user!.id;
  const actorIp = req.ip;

  await announcementsService.deleteAnnouncement(announcementId, actorId, actorIp);
  res.status(200).json(apiResponse({ success: true }, "Announcement deleted successfully."));
}
