import type { Request, Response } from "express";
import { zParse } from "../../validations/zod.js";
import * as tasksService from "./classTasks.service.js";
import { createTaskSchema, updateTaskSchema } from "./classTasks.validation.js";
import { apiResponse } from "../../utils/apiResponse.js";

export async function getTasks(req: Request, res: Response) {
  const { classId } = req.params;
  const data = await tasksService.getClassTasks(classId);
  res.status(200).json(apiResponse(data));
}

export async function createTask(req: Request, res: Response) {
  const { classId } = req.params;
  const payload = await zParse(createTaskSchema, req.body);
  const actorId = req.user!.id;
  const actorIp = req.ip;

  const data = await tasksService.createTask(classId, actorId, payload, actorIp);
  res.status(201).json(apiResponse(data, "Task created successfully."));
}

export async function updateTask(req: Request, res: Response) {
  const { taskId } = req.params;
  const payload = await zParse(updateTaskSchema, req.body);
  const actorId = req.user!.id;
  const actorIp = req.ip;

  const data = await tasksService.updateTask(taskId, actorId, payload, actorIp);
  res.status(200).json(apiResponse(data, "Task updated successfully."));
}

export async function deleteTask(req: Request, res: Response) {
  const { taskId } = req.params;
  const actorId = req.user!.id;
  const actorIp = req.ip;

  await tasksService.deleteTask(taskId, actorId, actorIp);
  res.status(200).json(apiResponse({ success: true }, "Task deleted successfully."));
}

export async function getTaskCompletions(req: Request, res: Response) {
  const { taskId } = req.params;
  const data = await tasksService.getTaskCompletions(taskId);
  res.status(200).json(apiResponse(data));
}

export async function markTaskCompleted(req: Request, res: Response) {
  const { taskId } = req.params;
  const actorId = req.user!.id;

  const data = await tasksService.markTaskCompleted(taskId, actorId);
  res.status(200).json(apiResponse(data, "Task marked as completed."));
}
