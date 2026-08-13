import type { Request, Response } from "express";
import { assignCrSchema } from "./classes.validation.js";
import * as classesService from "./classes.service.js";
import { apiResponse } from "../../utils/apiResponse.js";

export async function getClassDetails(req: Request, res: Response) {
  const { classId } = req.params;
  const data = await classesService.getClassDetails(classId, req.user?.id);
  res.status(200).json(apiResponse(data));
}

export async function getClassMembers(req: Request, res: Response) {
  const { classId } = req.params;
  const data = await classesService.getClassMembers(classId);
  res.status(200).json(apiResponse(data));
}

export async function assignClassCr(req: Request, res: Response) {
  const { classId } = req.params;
  const { studentId } = req.body;
  const actorId = req.user!.id;
  const actorIp = req.ip;

  const data = await classesService.assignClassCr(classId, studentId, actorId, actorIp);
  res.status(200).json(apiResponse(data, "Class representative assigned successfully."));
}

export async function revokeClassCr(req: Request, res: Response) {
  const { classId, studentId } = req.params;
  const actorId = req.user!.id;
  const actorIp = req.ip;

  await classesService.revokeClassCr(classId, studentId, actorId, actorIp);
  res.status(200).json(apiResponse({ success: true }, "Class representative role revoked successfully."));
}
