import { apiClient } from "./client";
import { apiEndpoints } from "./endpoints";
import type { ClassTaskResponse } from "@mynsut/shared";

export const classTasksApi = {
  list: async (classId: string) => {
    const response = await apiClient<ClassTaskResponse[]>(
      apiEndpoints.classTasks.list(classId),
      { method: "GET" }
    );
    return response;
  },
};
