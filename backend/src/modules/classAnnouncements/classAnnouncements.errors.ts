import { ApiError } from "../../utils/apiError.js";

export const classAnnouncementErrors = {
  notFound: () => new ApiError(404, "Class announcement not found", { code: "CLASS_ANNOUNCEMENT_NOT_FOUND" }),
  forbidden: () => new ApiError(403, "You do not have permission to manage this announcement", { code: "CLASS_ANNOUNCEMENT_FORBIDDEN" }),
};
