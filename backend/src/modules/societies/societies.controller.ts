import { Request, Response } from "express";
import { societiesService } from "./societies.service.js";
import { createSocietySchema, updateSocietySchema, societyFilterSchema } from "./societies.validation.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { SocietyNotFoundError } from "./societies.errors.js";

export const societiesController = {
  async getSocieties(req: Request, res: Response) {
    try {
      const filters = societyFilterSchema.parse(req.query);
      const result = await societiesService.getSocieties(filters);
      res.status(200).json(apiResponse(result.data, "Societies retrieved successfully", result.meta));
    } catch (error) {
      res.status(400).json(apiResponse(null, "Invalid query parameters"));
    }
  },

  async getSocietyById(req: Request, res: Response) {
    try {
      const society = await societiesService.getSocietyById(req.params.societyId as string);
      res.status(200).json(apiResponse(society, "Society retrieved successfully"));
    } catch (error) {
      if (error instanceof SocietyNotFoundError) {
        res.status(404).json(apiResponse(null, error.message));
      } else {
        res.status(500).json(apiResponse(null, "Internal server error"));
      }
    }
  },

  async createSociety(req: Request, res: Response) {
    try {
      const data = createSocietySchema.parse(req.body);
      const society = await societiesService.createSociety(req.auth!.userId, data, req.ip);
      res.status(201).json(apiResponse(society, "Society created successfully"));
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json(apiResponse(null, "Validation failed", error.errors));
      } else {
        res.status(500).json(apiResponse(null, "Internal server error"));
      }
    }
  },

  async updateSociety(req: Request, res: Response) {
    try {
      const data = updateSocietySchema.parse(req.body);
      const society = await societiesService.updateSociety(req.params.societyId as string, req.auth!.userId, data, req.ip);
      res.status(200).json(apiResponse(society, "Society updated successfully"));
    } catch (error: any) {
      if (error instanceof SocietyNotFoundError) {
        res.status(404).json(apiResponse(null, error.message));
      } else if (error.name === "ZodError") {
        res.status(400).json(apiResponse(null, "Validation failed", error.errors));
      } else {
        res.status(500).json(apiResponse(null, "Internal server error"));
      }
    }
  }
};