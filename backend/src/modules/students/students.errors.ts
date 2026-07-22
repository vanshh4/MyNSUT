import { ApiError } from "../../utils/apiError.js";

export const studentErrors = {
  alreadyOnboarded: () =>
    new ApiError(409, "Student onboarding has already been completed.", {
      code: "ONBOARDING_ALREADY_COMPLETED",
    }),
  invalidRollNumber: () =>
    new ApiError(400, "The UMS roll number is invalid.", { code: "INVALID_UMS_ROLL_NUMBER" }),
  unsupportedBranch: () =>
    new ApiError(400, "The UMS roll number contains an unsupported branch code.", {
      code: "UNSUPPORTED_BRANCH_CODE",
    }),
  invalidAdmissionYear: () =>
    new ApiError(400, "The admission year is outside the supported range.", {
      code: "INVALID_ADMISSION_YEAR",
    }),
  invalidSection: () =>
    new ApiError(400, "Section must be 1, 2, or 3.", { code: "INVALID_SECTION" }),
  rollNumberTaken: () =>
    new ApiError(409, "This UMS roll number is already registered.", {
      code: "ROLL_NUMBER_ALREADY_REGISTERED",
    }),
  classNotFound: () =>
    new ApiError(409, "The corresponding class has not been created by an administrator.", {
      code: "CLASS_NOT_AVAILABLE",
    }),
  profileNotFound: () =>
    new ApiError(404, "The student profile was not found.", { code: "STUDENT_PROFILE_NOT_FOUND" }),
};
