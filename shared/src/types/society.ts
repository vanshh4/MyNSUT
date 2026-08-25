import { z } from "zod";
import { SOCIETY_CATEGORIES } from "../constants/societies.js";

// Enums
export const SocietyCategorySchema = z.enum(SOCIETY_CATEGORIES);

// Models
export const SocietySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(120),
  description: z.string().nullable(),
  category: SocietyCategorySchema,
  logoUrl: z.string().url().nullable(),
  coverImageUrl: z.string().url().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SocietyMembershipSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  societyId: z.string().uuid(),
  joinedAt: z.date(),
});

export const SocietyPositionSchema = z.object({
  id: z.string().uuid(),
  societyId: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(120),
  parentPositionId: z.string().uuid().nullable(),
  canAssignPOR: z.boolean(),
  canManageMembers: z.boolean(),
  canPostAnnouncements: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SocietyAnnouncementSchema = z.object({
  id: z.string().uuid(),
  societyId: z.string().uuid(),
  authorId: z.string().uuid(),
  content: z.string().min(1, "Content is required"),
  attachmentUrl: z.string().url().nullable(),
  isPublic: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Payloads
export const CreateSocietyPayloadSchema = SocietySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateSocietyPayloadSchema = CreateSocietyPayloadSchema.partial();

export const AssignPositionPayloadSchema = z.object({
  userId: z.string().min(1, "User ID or Roll Number is required"),
  positionId: z.string().uuid(),
});

export const AddMemberPayloadSchema = z.object({
  email: z.string().email(),
});

export const CreateAnnouncementPayloadSchema = SocietyAnnouncementSchema.omit({
  id: true,
  authorId: true,
  societyId: true,
  createdAt: true,
  updatedAt: true,
});

export type Society = z.infer<typeof SocietySchema>;
export type SocietyMembership = z.infer<typeof SocietyMembershipSchema>;
export type SocietyPosition = z.infer<typeof SocietyPositionSchema>;
export type SocietyAnnouncement = z.infer<typeof SocietyAnnouncementSchema>;
export type CreateSocietyPayload = z.infer<typeof CreateSocietyPayloadSchema>;
export type UpdateSocietyPayload = z.infer<typeof UpdateSocietyPayloadSchema>;
export type AssignPositionPayload = z.infer<typeof AssignPositionPayloadSchema>;
export type AddMemberPayload = z.infer<typeof AddMemberPayloadSchema>;
export type CreateAnnouncementPayload = z.infer<typeof CreateAnnouncementPayloadSchema>;
