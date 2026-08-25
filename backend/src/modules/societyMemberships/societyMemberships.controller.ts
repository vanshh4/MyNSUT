import { Request, Response } from "express";
import { societyMembershipsService } from "./societyMemberships.service.js";
import { addMemberSchema } from "./societyMemberships.validation.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { 
  UserNotFoundError, 
  AlreadyMemberError, 
  UnauthorizedManageMembersError,
  SocietyMembershipNotFoundError 
} from "./societyMemberships.errors.js";

export const societyMembershipsController = {
  async addMember(req: Request, res: Response) {
    try {
      const { email } = addMemberSchema.parse(req.body);
      const membership = await societyMembershipsService.addMember(req.params.societyId as string, req.auth!.userId, email, req.ip);
      res.status(201).json(apiResponse(membership, "Member added successfully"));
    } catch (error: any) {
      if (error instanceof UnauthorizedManageMembersError || error instanceof UserNotFoundError || error instanceof AlreadyMemberError) {
        res.status(400).json(apiResponse(null, error.message));
      } else if (error.name === "ZodError") {
        res.status(400).json(apiResponse(null, "Validation failed", error.errors));
      } else {
        res.status(500).json(apiResponse(null, "Internal server error"));
      }
    }
  },

  async removeMember(req: Request, res: Response) {
    try {
      await societyMembershipsService.removeMember(req.params.societyId as string, req.auth!.userId, req.params.userId as string, req.ip);
      res.status(200).json(apiResponse(null, "Member removed successfully"));
    } catch (error: any) {
      if (error instanceof UnauthorizedManageMembersError || error instanceof SocietyMembershipNotFoundError) {
        res.status(400).json(apiResponse(null, error.message));
      } else {
        res.status(500).json(apiResponse(null, "Internal server error"));
      }
    }
  },

  async getMembers(req: Request, res: Response) {
    try {
      const members = await societyMembershipsService.getMembers(req.params.societyId as string, req.auth!.userId);
      res.status(200).json(apiResponse(members, "Members retrieved successfully"));
    } catch (error: any) {
      if (error instanceof SocietyMembershipNotFoundError) {
        res.status(403).json(apiResponse(null, error.message));
      } else {
        res.status(500).json(apiResponse(null, "Internal server error"));
      }
    }
  }
};