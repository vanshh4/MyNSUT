import { z } from "zod";

const urlAttachmentSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  url: z.string().url("Invalid URL"),
  displayName: z.string().optional(),
});

export const createAnnouncementSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  attachments: z.array(urlAttachmentSchema).optional(),
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();
