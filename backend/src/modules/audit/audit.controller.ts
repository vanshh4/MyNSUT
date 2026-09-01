import type { RequestHandler } from "express";
import { validateQuery, validateParams } from "../../middlewares/validation.middleware.js";
import { auditLogQuerySchema, auditLogIdParamsSchema } from "./audit.validation.js";
import * as auditService from "./audit.service.js";
import { ApiError } from "../../utils/apiError.js";

export const listAuditLogs: RequestHandler[] = [
  validateQuery(auditLogQuerySchema),
  async (req, res, next) => {
    try {
      const filters = req.query as any;
      const pagination = {
        page: filters.page,
        limit: filters.limit,
      };
      const response = await auditService.getAuditLogs(filters, pagination);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
];

export const getAuditLog: RequestHandler[] = [
  validateParams(auditLogIdParamsSchema),
  async (req, res, next) => {
    try {
      const log = await auditService.getAuditLogById(req.params.id as string);
      if (!log) {
        throw new ApiError(404, "Audit log not found");
      }
      res.json(log);
    } catch (error) {
      next(error);
    }
  }
];
