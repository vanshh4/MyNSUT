import type { RequestHandler } from "express";
import { validateQuery, validateBody, validateParams } from "../../../middlewares/validation.middleware.js";
import { listRolesQuerySchema, userAssignmentsParamsSchema, assignRoleBodySchema, revokeRoleParamsSchema, revokeRoleBodySchema } from "./adminRoles.validation.js";
import * as adminRolesService from "./adminRoles.service.js";

export const listRoles: RequestHandler[] = [
  validateQuery(listRolesQuerySchema),
  async (req, res, next) => {
    try {
      const scopeFilter = req.query.scope as any;
      const roles = await adminRolesService.listRoles(scopeFilter);
      res.json({ data: roles });
    } catch (error) {
      next(error);
    }
  }
];

export const listUserAssignments: RequestHandler[] = [
  validateParams(userAssignmentsParamsSchema),
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const assignments = await adminRolesService.listUserAssignments(userId);
      res.json({ data: assignments });
    } catch (error) {
      next(error);
    }
  }
];

export const assignRole: RequestHandler[] = [
  validateBody(assignRoleBodySchema),
  async (req, res, next) => {
    try {
      const command = req.body;
      const actorId = req.auth!.user.id;
      const ipAddress = req.ip;
      await adminRolesService.assignRole(command, actorId, ipAddress);
      res.status(201).json({ message: "Role assigned successfully." });
    } catch (error) {
      next(error);
    }
  }
];

export const revokeRole: RequestHandler[] = [
  validateParams(revokeRoleParamsSchema),
  validateBody(revokeRoleBodySchema),
  async (req, res, next) => {
    try {
      const { assignmentId } = req.params;
      const { scope } = req.body;
      const actorId = req.auth!.user.id;
      const ipAddress = req.ip;
      await adminRolesService.revokeRole({ assignmentId, scope }, actorId, ipAddress);
      res.json({ message: "Role revoked successfully." });
    } catch (error) {
      next(error);
    }
  }
];
