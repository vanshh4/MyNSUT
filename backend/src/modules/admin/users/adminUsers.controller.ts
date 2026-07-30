import type { RequestHandler } from "express";
import { validateQuery, validateParams } from "../../../middlewares/validation.middleware.js";
import { searchUsersQuerySchema, userDetailParamsSchema } from "./adminUsers.validation.js";
import * as adminUsersService from "./adminUsers.service.js";

export const searchUsers: RequestHandler[] = [
  validateQuery(searchUsersQuerySchema),
  async (req, res, next) => {
    try {
      const filters = req.query as any;
      const pagination = {
        page: filters.page,
        limit: filters.limit,
      };
      const response = await adminUsersService.searchUsers(filters, pagination);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
];

export const getUserDetail: RequestHandler[] = [
  validateParams(userDetailParamsSchema),
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const user = await adminUsersService.getUserDetail(userId);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  }
];
