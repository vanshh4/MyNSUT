import { z } from "zod";
import { CLASS_TASK_TYPE } from "@mynsut/shared/constants/class";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().optional(),
  taskType: z.enum([
    CLASS_TASK_TYPE.FILL_FORM,
    CLASS_TASK_TYPE.READ_DOCUMENT,
    CLASS_TASK_TYPE.SUBMIT_ASSIGNMENT,
    CLASS_TASK_TYPE.OTHER
  ]),
  url: z.string().url("Invalid URL").optional(),
  dueDate: z.string().datetime().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
