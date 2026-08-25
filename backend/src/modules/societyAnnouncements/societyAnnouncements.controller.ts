import { Request, Response } from "express";
import { societyAnnouncementsService } from "./societyAnnouncements.service.js";
import { createAnnouncementSchema } from "./societyAnnouncements.validation.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { UnauthorizedPostAnnouncementError } from "./societyAnnouncements.errors.js";

export const societyAnnouncementsController = {
  async getAnnouncements(req: Request, res: Response) {
    try {
      const announcements = await societyAnnouncementsService.getAnnouncements(req.params.societyId as string, req.auth?.userId);
      res.status(200).json(apiResponse(announcements, "Announcements retrieved successfully"));
    } catch (error) {
      res.status(500).json(apiResponse(null, "Internal server error"));
    }
  },

  async createAnnouncement(req: Request, res: Response) {
    try {
      const data = createAnnouncementSchema.parse(req.body);
      const announcement = await societyAnnouncementsService.createAnnouncement(req.params.societyId as string, req.auth!.userId, data, req.ip);
      res.status(201).json(apiResponse(announcement, "Announcement created successfully"));
    } catch (error: any) {
      if (error instanceof UnauthorizedPostAnnouncementError) {
        res.status(403).json(apiResponse(null, error.message));
      } else if (error.name === "ZodError") {
        res.status(400).json(apiResponse(null, "Validation failed", error.errors));
      } else {
        res.status(500).json(apiResponse(null, "Internal server error"));
      }
    }
  }
};