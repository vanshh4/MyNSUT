import { Request, Response } from "express";
import { eventsService } from "./events.service.js";
import { createEventSchema, updateEventSchema, eventFilterSchema } from "./events.validation.js";
import { apiResponse, apiErrorResponse } from "../../utils/apiResponse.js";
import { EventNotFoundError, EventOwnershipError } from "./events.errors.js";

export const eventsController = {
  async getEvents(req: Request, res: Response) {
    try {
      const filters = eventFilterSchema.parse(req.query) as any;
      const result = await eventsService.getEvents(filters);
      res.status(200).json(apiResponse(result.data, "Events retrieved successfully", result.meta));
    } catch (error) {
      res.status(400).json(apiErrorResponse("Invalid query parameters", "VALIDATION_ERROR"));
    }
  },

  async getEventById(req: Request, res: Response) {
    try {
      const event = await eventsService.getEventById(req.params.eventId as string);
      res.status(200).json(apiResponse(event, "Event retrieved successfully"));
    } catch (error) {
      if (error instanceof EventNotFoundError) {
        res.status(404).json(apiErrorResponse(error.message, "NOT_FOUND"));
      } else {
        res.status(500).json(apiErrorResponse("Internal server error"));
      }
    }
  },

  async createEvent(req: Request, res: Response) {
    try {
      const data = createEventSchema.parse(req.body) as any;
      const event = await eventsService.createEvent(req.auth!.userId, data, req.ip);
      res.status(201).json(apiResponse(event, "Event created successfully"));
    } catch (error: any) {
      console.error("CreateEvent error:", error);
      if (error instanceof EventOwnershipError) {
        res.status(403).json(apiErrorResponse(error.message, "FORBIDDEN"));
      } else if (error.name === "ZodError") {
        res.status(400).json(apiErrorResponse("Validation failed", "VALIDATION_ERROR", error.errors));
      } else {
        res.status(400).json(apiErrorResponse(error.message || "Bad request", "BAD_REQUEST"));
      }
    }
  },

  async updateEvent(req: Request, res: Response) {
    try {
      const data = updateEventSchema.parse(req.body) as any;
      const event = await eventsService.updateEvent(req.params.eventId as string, req.auth!.userId, data, req.ip);
      res.status(200).json(apiResponse(event, "Event updated successfully"));
    } catch (error: any) {
      if (error instanceof EventNotFoundError) {
        res.status(404).json(apiErrorResponse(error.message, "NOT_FOUND"));
      } else if (error instanceof EventOwnershipError) {
        res.status(403).json(apiErrorResponse(error.message, "FORBIDDEN"));
      } else if (error.name === "ZodError") {
        res.status(400).json(apiErrorResponse("Validation failed", "VALIDATION_ERROR", error.errors));
      } else {
        res.status(400).json(apiErrorResponse(error.message || "Bad request", "BAD_REQUEST"));
      }
    }
  }
};
