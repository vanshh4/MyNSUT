import { z } from "zod";
import { CreateSocietyPayloadSchema, UpdateSocietyPayloadSchema } from "@mynsut/shared";

export const createSocietySchema = CreateSocietyPayloadSchema;
export const updateSocietySchema = UpdateSocietyPayloadSchema;

export const societyFilterSchema = z.object({
  category: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});