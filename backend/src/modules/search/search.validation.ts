import { z } from "zod";

export const searchSchema = z.object({
  q: z.string().min(3, "Search query must be at least 3 characters long.").max(100),
});
