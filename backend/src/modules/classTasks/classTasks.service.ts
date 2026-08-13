import { prisma } from "../../db/prisma.js";
import { classTaskErrors } from "./classTasks.errors.js";
import * as tasksRepository from "./classTasks.repository.js";
import { findStudentByUserId } from "../students/students.repository.js";
import { logAction } from "../audit/audit.service.js";
import { AUDIT_ACTIONS } from "../../constants/audit.js";
import type { ClassTaskPayload } from "@mynsut/shared/types/class";

export async function getClassTasks(classId: string) {
  return tasksRepository.findTasksByClassId(prisma, classId);
}

export async function createTask(classId: string, authorId: string, data: ClassTaskPayload, actorIp?: string) {
  return prisma.$transaction(async (tx) => {
    const task = await tasksRepository.createTask(tx, classId, authorId, data);
    
    await logAction(
      tx,
      authorId,
      AUDIT_ACTIONS.CLASS_TASK_CREATED,
      "CLASS_TASK",
      task.id,
      undefined,
      { classId, title: data.title },
      actorIp
    );
    
    return task;
  });
}

export async function updateTask(taskId: string, authorId: string, data: Partial<ClassTaskPayload>, actorIp?: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await tasksRepository.findTaskById(tx, taskId);
    if (!existing) throw classTaskErrors.notFound();
    if (existing.authorId !== authorId) throw classTaskErrors.forbidden();

    const updated = await tasksRepository.updateTask(tx, taskId, data);
    
    await logAction(
      tx,
      authorId,
      AUDIT_ACTIONS.CLASS_TASK_UPDATED,
      "CLASS_TASK",
      taskId,
      undefined,
      { classId: existing.classId },
      actorIp
    );
    
    return updated;
  });
}

export async function deleteTask(taskId: string, authorId: string, actorIp?: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await tasksRepository.findTaskById(tx, taskId);
    if (!existing) throw classTaskErrors.notFound();
    if (existing.authorId !== authorId) throw classTaskErrors.forbidden();

    await tasksRepository.deleteTask(tx, taskId);
    
    await logAction(
      tx,
      authorId,
      AUDIT_ACTIONS.CLASS_TASK_DELETED,
      "CLASS_TASK",
      taskId,
      undefined,
      { classId: existing.classId },
      actorIp
    );
  });
}

export async function getTaskCompletions(taskId: string) {
  const existing = await tasksRepository.findTaskById(prisma, taskId);
  if (!existing) throw classTaskErrors.notFound();
  return tasksRepository.getTaskCompletions(prisma, taskId);
}

export async function markTaskCompleted(taskId: string, userId: string) {
  const student = await findStudentByUserId(prisma, userId);
  if (!student) throw classTaskErrors.studentNotFound();

  const existingTask = await tasksRepository.findTaskById(prisma, taskId);
  if (!existingTask) throw classTaskErrors.notFound();

  // Optionally ensure the student belongs to the task's class
  if (student.classId !== existingTask.classId) {
    throw classTaskErrors.forbidden();
  }

  // Idempotent upsert
  return tasksRepository.completeTask(prisma, taskId, student.id);
}
