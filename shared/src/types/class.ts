import type { ClassTaskType } from "../constants/class.js";
import type { IsoDateString, EntityId } from "./index.js";
import type { PublicProfileProjection } from "./profile.js";

export interface UrlAttachment {
  title: string;
  url: string;
  displayName?: string;
}

export interface ClassAnnouncementPayload {
  title: string;
  content: string;
  attachments?: UrlAttachment[];
}

export interface ClassAnnouncementResponse {
  id: EntityId;
  classId: EntityId;
  authorId: EntityId;
  author: PublicProfileProjection;
  title: string;
  content: string;
  attachments: UrlAttachment[] | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface ClassTaskPayload {
  title: string;
  description?: string;
  taskType: ClassTaskType;
  url?: string;
  dueDate?: IsoDateString;
}

export interface ClassTaskResponse {
  id: EntityId;
  classId: EntityId;
  authorId: EntityId;
  author: PublicProfileProjection;
  title: string;
  description: string | null;
  taskType: ClassTaskType;
  url: string | null;
  dueDate: IsoDateString | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface ClassTaskCompletionSummary {
  taskId: EntityId;
  studentId: EntityId;
  completedAt: IsoDateString;
}
