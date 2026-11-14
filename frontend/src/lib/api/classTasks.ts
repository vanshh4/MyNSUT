import { apiClient } from "./client";
import { apiEndpoints } from "./endpoints";
import type {
  ClassTaskResponse,
  ClassTaskPayload,
  ClassTaskCompletionResponse,
} from "@mynsut/shared";

export const classTasksApi = {
  list: async (classId: string) => {
    return apiClient<ClassTaskResponse[]>(apiEndpoints.classTasks.list(classId), {
      method: "GET",
    });
  },

  create: async (classId: string, payload: ClassTaskPayload) => {
    return apiClient<ClassTaskResponse>(apiEndpoints.classTasks.create(classId), {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (classId: string, taskId: string, payload: Partial<ClassTaskPayload>) => {
    return apiClient<ClassTaskResponse>(apiEndpoints.classTasks.update(classId, taskId), {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  delete: async (classId: string, taskId: string) => {
    return apiClient<{ success: boolean }>(apiEndpoints.classTasks.delete(classId, taskId), {
      method: "DELETE",
    });
  },

  completions: async (classId: string, taskId: string) => {
    return apiClient<ClassTaskCompletionResponse[]>(
      apiEndpoints.classTasks.completions(classId, taskId),
      {
        method: "GET",
      }
    );
  },

  complete: async (classId: string, taskId: string) => {
    return apiClient<ClassTaskCompletionResponse>(
      apiEndpoints.classTasks.complete(classId, taskId),
      {
        method: "POST",
      }
    );
  },
};
