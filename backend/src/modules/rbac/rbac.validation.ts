import { ROLE_CODES } from "@mynsut/shared/constants/roles";
import { SCOPE_CODES } from "@mynsut/shared/constants/scopes";
import { z } from "zod";

export const roleCodeSchema = z.enum(ROLE_CODES as [string, ...string[]]);
export const scopeCodeSchema = z.enum(SCOPE_CODES as [string, ...string[]]);

export const assignRoleBodySchema = z.object({
  userId: z.string().uuid(),
  roleCode: roleCodeSchema,
  scope: scopeCodeSchema,
  scopeId: z.string().uuid().optional(),
});

export const revokeRoleParamsSchema = z.object({
  assignmentId: z.string().min(1),
});

export const revokeRoleBodySchema = z.object({
  scope: scopeCodeSchema,
});
