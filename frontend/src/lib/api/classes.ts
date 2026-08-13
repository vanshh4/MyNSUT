import type {
  AssignedClass,
  ClassMember,
  ClassAnnouncementResponse,
  ClassAnnouncementPayload,
  ClassTaskResponse,
  ClassTaskPayload,
  ClassTaskCompletionResponse
} from "@mynsut/shared/types/class";
import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export async function getClassDetails(classId: string): Promise<AssignedClass> {
  const response = await apiClient<AssignedClass>(apiEndpoints.classes.detail(classId), { method: "GET" });
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function getClassMembers(classId: string): Promise<ClassMember[]> {
  const response = await apiClient<ClassMember[]>(apiEndpoints.classes.members(classId), { method: "GET" });
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function getClassAnnouncements(classId: string): Promise<ClassAnnouncementResponse[]> {
  const response = await apiClient<ClassAnnouncementResponse[]>(apiEndpoints.classAnnouncements.list(classId), { method: "GET" });
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function createAnnouncement(classId: string, payload: ClassAnnouncementPayload): Promise<ClassAnnouncementResponse> {
  const response = await apiClient<ClassAnnouncementResponse>(apiEndpoints.classAnnouncements.create(classId), {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function updateAnnouncement(classId: string, announcementId: string, payload: Partial<ClassAnnouncementPayload>): Promise<ClassAnnouncementResponse> {
  const response = await apiClient<ClassAnnouncementResponse>(apiEndpoints.classAnnouncements.update(classId, announcementId), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function deleteAnnouncement(classId: string, announcementId: string): Promise<void> {
  const response = await apiClient<{ success: boolean }>(apiEndpoints.classAnnouncements.delete(classId, announcementId), { method: "DELETE" });
  if (!response.success) throw new Error(response.message);
}

export async function getClassTasks(classId: string): Promise<ClassTaskResponse[]> {
  const response = await apiClient<ClassTaskResponse[]>(apiEndpoints.classTasks.list(classId), { method: "GET" });
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function createTask(classId: string, payload: ClassTaskPayload): Promise<ClassTaskResponse> {
  const response = await apiClient<ClassTaskResponse>(apiEndpoints.classTasks.create(classId), {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function updateTask(classId: string, taskId: string, payload: Partial<ClassTaskPayload>): Promise<ClassTaskResponse> {
  const response = await apiClient<ClassTaskResponse>(apiEndpoints.classTasks.update(classId, taskId), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function deleteTask(classId: string, taskId: string): Promise<void> {
  const response = await apiClient<{ success: boolean }>(apiEndpoints.classTasks.delete(classId, taskId), { method: "DELETE" });
  if (!response.success) throw new Error(response.message);
}

export async function getTaskCompletions(classId: string, taskId: string): Promise<ClassTaskCompletionResponse[]> {
  const response = await apiClient<ClassTaskCompletionResponse[]>(apiEndpoints.classTasks.completions(classId, taskId), { method: "GET" });
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export async function completeTask(classId: string, taskId: string): Promise<ClassTaskCompletionResponse> {
  const response = await apiClient<ClassTaskCompletionResponse>(apiEndpoints.classTasks.complete(classId, taskId), {
    method: "POST",
  });
  if (!response.success) throw new Error(response.message);
  return response.data;
}
