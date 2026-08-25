import { Request, Response } from "express";
import { registrationsService } from "./registrations.service.js";
import { registrationsRepository } from "./registrations.repository.js";
import { registrationExportService } from "./registrationExport.service.js";
import { eventRegistrationActionSchema } from "./registrations.validation.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { prisma } from "../../db/prisma.js";

export const registrationsController = {
  async getState(req: Request, res: Response) {
    try {
      const student = await prisma.student.findUnique({ where: { userId: req.auth!.userId } });
      if (!student) {
        return res.status(403).json(apiResponse(null, "Only students can register for events"));
      }
      
      const state = await registrationsRepository.getStudentRegistrationState(req.params.eventId as string, student.id);
      res.status(200).json(apiResponse(state, "Registration state retrieved"));
    } catch (error: any) {
      res.status(500).json(apiResponse(null, "Internal server error"));
    }
  },

  async handleAction(req: Request, res: Response) {
    try {
      const { action } = eventRegistrationActionSchema.parse(req.body);
      const student = await prisma.student.findUnique({ where: { userId: req.auth!.userId } });
      if (!student) {
        return res.status(403).json(apiResponse(null, "Only students can register for events"));
      }

      const result = await registrationsService.handleRegistrationAction(req.params.eventId as string, student.id, action as any);
      res.status(200).json(apiResponse(result, "Action completed successfully"));
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json(apiResponse(null, "Validation failed", error.errors));
      } else {
        res.status(500).json(apiResponse(null, error.message || "Internal server error"));
      }
    }
  },

  async exportRegistrations(req: Request, res: Response) {
    try {
      const csv = await registrationExportService.generateExportCsv(req.params.eventId as string, req.auth!.userId, req.ip);
      res.header('Content-Type', 'text/csv');
      res.attachment(`event-${req.params.eventId}-registrations.csv`);
      res.status(200).send(csv);
    } catch (error: any) {
      res.status(403).json(apiResponse(null, error.message || "Not authorized to export"));
    }
  }
};
