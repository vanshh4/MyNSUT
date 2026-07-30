import { z } from "zod";

export const searchUsersQuerySchema = z.object({
  q: z.string().optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "DELETED", "ALL"]).optional(),
  branchCode: z.string().optional(),
  admissionYear: z.coerce.number().int().min(2000).max(2100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const userDetailParamsSchema = z.object({
  userId: z.string().uuid(),
});
