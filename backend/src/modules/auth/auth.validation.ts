import { z } from "zod";

export const googleCallbackQuerySchema = z
  .object({
    code: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    error: z.string().min(1).optional(),
    error_description: z.string().optional(),
  })
  .refine((value) => Boolean(value.error) || Boolean(value.code && value.state), {
    message: "The OAuth callback must contain an authorization code and state, or an error.",
  });

export type GoogleCallbackQuery = z.infer<typeof googleCallbackQuerySchema>;
