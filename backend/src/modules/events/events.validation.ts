import { z } from "zod";
import { EVENT_STATUS } from "@mynsut/shared";

export const createEventSchema = z.object({
  societyId: z.string().uuid(),
  title: z.string().min(3).max(255),
  description: z.string().nullable().optional(),
  coverImageUrl: z.string().url().nullable().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string().max(255).nullable().optional(),
  maxCapacity: z.number().int().positive(),
});

export const updateEventSchema = createEventSchema.partial().extend({
  status: z.nativeEnum(EVENT_STATUS).optional()
});

export const eventFilterSchema = z.object({
  societyId: z.string().uuid().optional(),
  status: z.nativeEnum(EVENT_STATUS).optional(),
  upcoming: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});
