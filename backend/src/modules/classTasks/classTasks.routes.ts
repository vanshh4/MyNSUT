import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as tasksController from "./classTasks.controller.js";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware.js";
import { requireScopedPermission } from "../../middlewares/requireScopedPermission.middleware.js";
import { SCOPES } from "@mynsut/shared/constants/scopes";
import { validateBody } from "../../middlewares/validation.middleware.js";
import { createTaskSchema, updateTaskSchema } from "./classTasks.validation.js";

export const classTasksRoutes = Router({ mergeParams: true });

classTasksRoutes.use(authenticateMiddleware);

// Get all tasks for a class
classTasksRoutes.get(
  "/",
  asyncHandler(tasksController.getTasks)
);

// Create a task
classTasksRoutes.post(
  "/",
  requireScopedPermission("CLASS_TASK_CREATE"),
  validateBody(createTaskSchema),
  asyncHandler(tasksController.createTask)
);

// Update a task
classTasksRoutes.patch(
  "/:taskId",
  requireScopedPermission("CLASS_TASK_UPDATE"),
  validateBody(updateTaskSchema),
  asyncHandler(tasksController.updateTask)
);

// Delete a task
classTasksRoutes.delete(
  "/:taskId",
  requireScopedPermission("CLASS_TASK_DELETE"),
  asyncHandler(tasksController.deleteTask)
);

// Get completions for a task
classTasksRoutes.get(
  "/:taskId/completions",
  requireScopedPermission("CLASS_TASK_VIEW_COMPLETION_SUMMARY"),
  asyncHandler(tasksController.getTaskCompletions)
);

// Mark a task as completed (for self)
classTasksRoutes.post(
  "/:taskId/complete",
  // Implicitly limited to the authenticated user via their own token
  // Students in the class can complete tasks
  requireScopedPermission("CLASS_TASK_COMPLETE_SELF"),
  asyncHandler(tasksController.markTaskCompleted)
);
