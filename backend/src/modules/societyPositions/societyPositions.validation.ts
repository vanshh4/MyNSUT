import { z } from "zod";
import { SocietyPositionSchema, AssignPositionPayloadSchema } from "@mynsut/shared";

export const createPositionSchema = SocietyPositionSchema.omit({
  id: true,
  societyId: true,
  createdAt: true,
  updatedAt: true,
});

export const assignPositionSchema = AssignPositionPayloadSchema;