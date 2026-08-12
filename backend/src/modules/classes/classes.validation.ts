import { z } from "zod";

export const assignCrSchema = z.object({
  studentId: z.string().uuid("Invalid student ID"),
});

export const revokeCrSchema = z.object({
  studentId: z.string().uuid("Invalid student ID"),
});
