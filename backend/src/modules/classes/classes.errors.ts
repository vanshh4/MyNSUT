import { ApiError } from "../../utils/apiError.js";

export const classErrors = {
  classNotFound: () => new ApiError(404, "Academic class not found", { code: "CLASS_NOT_FOUND" }),
  memberNotFound: () => new ApiError(404, "Student is not a member of this class", { code: "CLASS_MEMBER_NOT_FOUND" }),
  invalidAssignment: () => new ApiError(400, "Invalid class assignment request", { code: "INVALID_CLASS_ASSIGNMENT" }),
};
