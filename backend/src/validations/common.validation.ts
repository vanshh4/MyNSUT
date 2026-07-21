import { z } from "zod";

export const uuidSchema = z.uuid("A valid UUID is required.");
export const emailSchema = z.email().transform((value) => value.trim().toLowerCase());
export const nsutEmailSchema = emailSchema.refine((email) => email.endsWith("@nsut.ac.in"), {
  message: "An official @nsut.ac.in email address is required.",
});
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export const umsRollNumberSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^\d{4}[A-Z]+\d+$/, "Use the format <year><branch_code><roll_number>.");
