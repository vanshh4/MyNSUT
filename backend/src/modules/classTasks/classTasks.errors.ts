import { ApiError } from "../../utils/apiError.js";

export const classTaskErrors = {
  notFound: () => new ApiError(404, "Class task not found", { code: "CLASS_TASK_NOT_FOUND" }),
  forbidden: () => new ApiError(403, "You do not have permission to manage this task", { code: "CLASS_TASK_FORBIDDEN" }),
  studentNotFound: () => new ApiError(404, "Student profile not found", { code: "STUDENT_NOT_FOUND" }),
};
