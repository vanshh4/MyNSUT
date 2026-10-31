import { Request, Response } from "express";
import { resourcesService } from "./resources.service.js";
import {
  createResourceSchema,
  updateResourceSchema,
  resourceFilterSchema,
} from "./resources.validation.js";
import { apiResponse, apiErrorResponse } from "../../utils/apiResponse.js";
import { ResourceNotFoundError, ResourceArchivedError } from "./resources.errors.js";

export const resourcesController = {
  async getResources(req: Request, res: Response) {
    try {
      const filters = resourceFilterSchema.parse(req.query);
      const result = await resourcesService.getResources(filters);
      res.status(200).json(apiResponse(result.data, "Resources retrieved successfully", result.meta));
    } catch (error: any) {
      res.status(400).json(apiErrorResponse("Invalid query parameters", "VALIDATION_ERROR", error?.errors));
    }
  },

  async getResourceById(req: Request, res: Response) {
    try {
      const resource = await resourcesService.getResourceById(req.params.resourceId as string);
      res.status(200).json(apiResponse(resource, "Resource retrieved successfully"));
    } catch (error: any) {
      if (error instanceof ResourceNotFoundError) {
        res.status(404).json(apiErrorResponse(error.message, "NOT_FOUND"));
      } else {
        res.status(500).json(apiErrorResponse("Internal server error", "INTERNAL_SERVER_ERROR"));
      }
    }
  },

  async createResource(req: Request, res: Response) {
    try {
      const data = createResourceSchema.parse(req.body);
      const resource = await resourcesService.createResource(req.auth!.userId, data);
      res.status(201).json(apiResponse(resource, "Resource created successfully"));
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json(apiErrorResponse("Validation failed", "VALIDATION_FAILED", error.errors));
      } else {
        res.status(500).json(apiErrorResponse(error?.message || "Internal server error", "INTERNAL_SERVER_ERROR"));
      }
    }
  },

  async updateResource(req: Request, res: Response) {
    try {
      const data = updateResourceSchema.parse(req.body);
      const resource = await resourcesService.updateResource(req.params.resourceId as string, data);
      res.status(200).json(apiResponse(resource, "Resource updated successfully"));
    } catch (error: any) {
      if (error instanceof ResourceNotFoundError) {
        res.status(404).json(apiErrorResponse(error.message, "NOT_FOUND"));
      } else if (error instanceof ResourceArchivedError) {
        res.status(400).json(apiErrorResponse(error.message, "RESOURCE_ARCHIVED"));
      } else if (error.name === "ZodError") {
        res.status(400).json(apiErrorResponse("Validation failed", "VALIDATION_FAILED", error.errors));
      } else {
        res.status(500).json(apiErrorResponse(error?.message || "Internal server error", "INTERNAL_SERVER_ERROR"));
      }
    }
  },

  async deleteResource(req: Request, res: Response) {
    try {
      await resourcesService.deleteResource(req.params.resourceId as string);
      res.status(200).json(apiResponse(null, "Resource deleted successfully"));
    } catch (error: any) {
      if (error instanceof ResourceNotFoundError) {
        res.status(404).json(apiErrorResponse(error.message, "NOT_FOUND"));
      } else {
        res.status(500).json(apiErrorResponse(error?.message || "Internal server error", "INTERNAL_SERVER_ERROR"));
      }
    }
  },
};
