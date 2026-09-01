import type { Request, Response } from "express";
import { assignCrSchema } from "./classes.validation.js";
import * as classesService from "./classes.service.js";
import { apiResponse } from "../../utils/apiResponse.js";

export async function getClassDetails(req: Request, res: Response) {
  const { classId } = req.params;
  const data = await classesService.getClassDetails(classId as string, req.auth?.userId);
  res.status(200).json(apiResponse(data));
}

export async function getClassMembers(req: Request, res: Response) {
  const { classId } = req.params;
  const data = await classesService.getClassMembers(classId as string);
  res.status(200).json(apiResponse(data));
}

export async function assignClassCr(req: Request, res: Response) {
  const { classId } = req.params;
  const { studentId } = req.body;
  const actorId = req.auth!.userId;
  const actorIp = req.ip;

  const data = await classesService.assignClassCr(classId as string, studentId, actorId, actorIp);
  res.status(200).json(apiResponse(data, "Class representative assigned successfully."));
}

export async function revokeClassCr(req: Request, res: Response) {
  const { classId, studentId } = req.params;
  const actorId = req.auth!.userId;
  const actorIp = req.ip;

  await classesService.revokeClassCr(classId as string, studentId as string, actorId, actorIp);
  res.status(200).json(apiResponse({ success: true }, "Class representative role revoked successfully."));
}

export async function listClasses(req: Request, res: Response) {
  const data = await classesService.listClasses();
  res.status(200).json(apiResponse(data));
}
