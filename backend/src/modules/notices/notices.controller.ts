import { Request, Response } from "express";
import { noticesService } from "./notices.service.js";
import {
  createNoticeSchema,
  updateNoticeSchema,
  noticeFilterSchema,
} from "./notices.validation.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { NoticeNotFoundError, UntrustedUrlError, NoticeArchivedError } from "./notices.errors.js";

export const noticesController = {
  async getNotices(req: Request, res: Response) {
    try {
      const filters = noticeFilterSchema.parse(req.query);
      const result = await noticesService.getNotices(filters);
      res.status(200).json(apiResponse(result.data, "Notices retrieved successfully", result.meta));
    } catch (error) {
      res.status(400).json(apiResponse(null, "Invalid query parameters"));
    }
  },

  async getNoticeById(req: Request, res: Response) {
    try {
      const notice = await noticesService.getNoticeById(req.params.noticeId);
      res.status(200).json(apiResponse(notice, "Notice retrieved successfully"));
    } catch (error) {
      if (error instanceof NoticeNotFoundError) {
        res.status(404).json(apiResponse(null, error.message));
      } else {
        res.status(500).json(apiResponse(null, "Internal server error"));
      }
    }
  },

  async createNotice(req: Request, res: Response) {
    try {
      const data = createNoticeSchema.parse(req.body);
      const notice = await noticesService.createNotice(
        req.auth!.userId,
        data,
        req.ip
      );
      res.status(201).json(apiResponse(notice, "Notice created successfully"));
    } catch (error: any) {
      if (error instanceof UntrustedUrlError) {
        res.status(400).json(apiResponse(null, error.message));
      } else if (error.name === "ZodError") {
        res.status(400).json(apiResponse(null, "Validation failed", error.errors));
      } else {
        res.status(500).json(apiResponse(null, "Internal server error"));
      }
    }
  },

  async updateNotice(req: Request, res: Response) {
    try {
      const data = updateNoticeSchema.parse(req.body);
      const notice = await noticesService.updateNotice(
        req.params.noticeId,
        req.auth!.userId,
        data,
        req.ip
      );
      res.status(200).json(apiResponse(notice, "Notice updated successfully"));
    } catch (error: any) {
      if (error instanceof NoticeNotFoundError) {
        res.status(404).json(apiResponse(null, error.message));
      } else if (error instanceof UntrustedUrlError || error instanceof NoticeArchivedError) {
        res.status(400).json(apiResponse(null, error.message));
      } else if (error.name === "ZodError") {
        res.status(400).json(apiResponse(null, "Validation failed", error.errors));
      } else {
        res.status(500).json(apiResponse(null, "Internal server error"));
      }
    }
  },

  async deleteNotice(req: Request, res: Response) {
    try {
      await noticesService.deleteNotice(req.params.noticeId, req.auth!.userId, req.ip);
      res.status(200).json(apiResponse(null, "Notice deleted successfully"));
    } catch (error) {
      if (error instanceof NoticeNotFoundError) {
        res.status(404).json(apiResponse(null, error.message));
      } else {
        res.status(500).json(apiResponse(null, "Internal server error"));
      }
    }
  },
};
