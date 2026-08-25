import { Request, Response } from "express";
import { societyPositionsService } from "./societyPositions.service.js";
import { createPositionSchema, assignPositionSchema } from "./societyPositions.validation.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { UnauthorizedAssignPORError, InvalidHierarchyError } from "./societyPositions.errors.js";

export const societyPositionsController = {
  async getPositions(req: Request, res: Response) {
    try {
      const positions = await societyPositionsService.getPositions(req.params.societyId as string);
      res.status(200).json(apiResponse(positions, "Positions retrieved successfully"));
    } catch (error) {
      res.status(500).json(apiResponse(null, "Internal server error"));
    }
  },

  async createPosition(req: Request, res: Response) {
    try {
      const data = createPositionSchema.parse(req.body);
      const isAdmin = req.auth!.permissions.includes("SOCIETY_CREATE") || req.auth!.permissions.includes("ROLE_ASSIGN_SOCIETY");
      const position = await societyPositionsService.createPosition(req.params.societyId as string, req.auth!.userId, data, req.ip, isAdmin);
      res.status(201).json(apiResponse(position, "Position created successfully"));
    } catch (error: any) {
      if (error instanceof UnauthorizedAssignPORError || error instanceof InvalidHierarchyError) {
        res.status(403).json(apiResponse(null, error.message));
      } else if (error.name === "ZodError") {
        res.status(400).json(apiResponse(null, "Validation failed", error.errors));
      } else {
        res.status(500).json(apiResponse(null, "Internal server error"));
      }
    }
  },

  async assignPosition(req: Request, res: Response) {
    try {
      const data = assignPositionSchema.parse(req.body);
      const isAdmin = req.auth!.permissions.includes("SOCIETY_CREATE") || req.auth!.permissions.includes("ROLE_ASSIGN_SOCIETY");
      const assignment = await societyPositionsService.assignPosition(req.params.societyId as string, req.auth!.userId, data, req.ip, isAdmin);
      res.status(201).json(apiResponse(assignment, "Position assigned successfully"));
    } catch (error: any) {
      if (error instanceof UnauthorizedAssignPORError || error instanceof InvalidHierarchyError) {
        res.status(403).json(apiResponse(null, error.message));
      } else if (error.name === "ZodError") {
        res.status(400).json(apiResponse(null, "Validation failed", error.errors));
      } else {
        res.status(500).json(apiResponse(null, "Internal server error"));
      }
    }
  },

  async revokePosition(req: Request, res: Response) {
    try {
      await societyPositionsService.revokePosition(req.params.societyId as string, req.auth!.userId, req.params.userId as string, req.params.positionId as string, req.ip);
      res.status(200).json(apiResponse(null, "Position revoked successfully"));
    } catch (error: any) {
      if (error instanceof UnauthorizedAssignPORError || error instanceof InvalidHierarchyError) {
        res.status(403).json(apiResponse(null, error.message));
      } else {
        res.status(500).json(apiResponse(null, "Internal server error"));
      }
    }
  }
};