import { z } from "zod";

export const eventRegistrationActionSchema = z.object({
  action: z.enum(["INTERESTED", "REGISTER", "CANCEL"])
});
