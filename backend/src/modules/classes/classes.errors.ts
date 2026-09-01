import { ApiError } from "../../utils/apiError.js";

export const classErrors = {
  classNotFound: () => new ApiError(404, "Academic class not found", { code: "CLASS_NOT_FOUND" }),
  memberNotFound: () => new ApiError(404, "Student is not a member of this class", { code: "CLASS_MEMBER_NOT_FOUND" }),
  invalidAssignment: () => new ApiError(400, "Invalid class assignment request", { code: "INVALID_CLASS_ASSIGNMENT" }),
  insufficientRole: () => new ApiError(403, "Insufficient class role to perform this action", { code: "INSUFFICIENT_CLASS_ROLE" }),
  announcementNotFound: () => new ApiError(404, "Announcement not found", { code: "ANNOUNCEMENT_NOT_FOUND" }),
  taskNotFound: () => new ApiError(404, "Task not found", { code: "TASK_NOT_FOUND" }),
};
