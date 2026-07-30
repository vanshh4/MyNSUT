import { z } from "zod";

export const auditLogQuerySchema = z.object({
  actorId: z.string().uuid().optional(),
  action: z.string().optional(),
  targetType: z.string().optional(),
  targetUserId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const auditLogIdParamsSchema = z.object({
  id: z.string().uuid(),
});
