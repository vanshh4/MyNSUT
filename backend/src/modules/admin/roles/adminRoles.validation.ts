import { z } from "zod";
import { roleCodeSchema, scopeCodeSchema, assignRoleBodySchema, revokeRoleParamsSchema, revokeRoleBodySchema } from "../../rbac/rbac.validation.js";

export const listRolesQuerySchema = z.object({
  scope: scopeCodeSchema.optional(),
});

export const userAssignmentsParamsSchema = z.object({
  userId: z.string().uuid(),
});

export { assignRoleBodySchema, revokeRoleParamsSchema, revokeRoleBodySchema };
