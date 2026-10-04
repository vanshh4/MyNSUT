import { z } from "zod";
import { RESOURCE_TYPES, RESOURCE_STATUS } from "../constants/resources.js";
import type { PaginatedResponse } from "./api.js";

export const ResourceTypeSchema = z.enum(Object.values(RESOURCE_TYPES) as [string, ...string[]]);
export const ResourceStatusSchema = z.enum(Object.values(RESOURCE_STATUS) as [string, ...string[]]);

export const ResourceSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().nullable(),
  resourceType: ResourceTypeSchema,
  subjectCode: z.string().min(1, "Subject code is required").max(20),
  subjectName: z.string().min(1, "Subject name is required").max(120),
  department: z.string().max(50).nullable(),
  semester: z.number().int().min(1).max(8).nullable(),
  academicYear: z.number().int().min(2000).max(2100).nullable(),
  examSession: z.string().max(50).nullable(),
  fileUrl: z.string().url("Valid URL is required"),
  source: z.string().max(255).nullable(),
  status: ResourceStatusSchema,
  creatorId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateResourcePayloadSchema = ResourceSchema.omit({
  id: true,
  creatorId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateResourcePayloadSchema = CreateResourcePayloadSchema.partial();

export const ResourceFiltersSchema = z.object({
  query: z.string().optional(),
  resourceType: ResourceTypeSchema.optional(),
  subjectCode: z.string().optional(),
  department: z.string().optional(),
  semester: z.coerce.number().optional(),
  academicYear: z.coerce.number().optional(),
  examSession: z.string().optional(),
  status: ResourceStatusSchema.optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

export type Resource = z.infer<typeof ResourceSchema>;
export type CreateResourcePayload = z.infer<typeof CreateResourcePayloadSchema>;
export type UpdateResourcePayload = z.infer<typeof UpdateResourcePayloadSchema>;
export type ResourceFilters = z.infer<typeof ResourceFiltersSchema>;
export type PaginatedResourceResponse = PaginatedResponse<Resource>;
