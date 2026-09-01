import { z } from "zod";

export const assignCrSchema = z.object({
  studentId: z.string().uuid("Invalid student ID"),
});

export const revokeCrSchema = z.object({
  studentId: z.string().uuid("Invalid student ID"),
});

export const createAnnouncementSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().min(1, "Content is required"),
  attachments: z.array(z.object({
    title: z.string().min(1),
    url: z.string().url(),
    displayName: z.string().optional()
  })).optional().nullable()
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional().nullable(),
  taskType: z.enum(["FILL_FORM", "READ_DOCUMENT", "SUBMIT_ASSIGNMENT", "OTHER"]),
  url: z.string().url().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable()
});

export const updateTaskSchema = createTaskSchema.partial();
