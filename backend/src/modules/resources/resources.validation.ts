import { z } from "zod";
import {
  CreateResourcePayloadSchema,
  UpdateResourcePayloadSchema,
  ResourceFiltersSchema,
} from "@mynsut/shared";

export const createResourceSchema = CreateResourcePayloadSchema;
export const updateResourceSchema = UpdateResourcePayloadSchema;
export const resourceFilterSchema = ResourceFiltersSchema;
