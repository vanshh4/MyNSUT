import { describe, expect, it, vi } from "vitest";

import { ApiClientError } from "./client";
import {
  extractFieldErrors,
  getApiErrorMessage,
  showApiErrorToast,
  showApiSuccessToast,
} from "./error";

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  toast: {
    error: vi.fn((msg) => msg),
    success: vi.fn((msg) => msg),
  },
}));

describe("Frontend API Error Formatter", () => {
  it("translates rate limit error codes to user-friendly text", () => {
    const error = new ApiClientError(429, "Too many requests", "RATE_LIMIT_EXCEEDED");
    const message = getApiErrorMessage(error);
    expect(message).toBe("Too many requests. Please wait a moment before trying again.");
  });

  it("translates CSRF error codes to user-friendly text", () => {
    const error = new ApiClientError(403, "CSRF failed", "CSRF_FORBIDDEN");
    const message = getApiErrorMessage(error);
    expect(message).toBe("Session verification failed. Please refresh the page and try again.");
  });

  it("translates payload too large error codes to user-friendly text", () => {
    const error = new ApiClientError(413, "Exceeded max limit", "PAYLOAD_TOO_LARGE");
    const message = getApiErrorMessage(error);
    expect(message).toBe("The requested file or payload exceeds the maximum allowed size limit.");
  });

  it("extracts field errors from validation details", () => {
    const error = new ApiClientError(400, "Validation failed", "VALIDATION_ERROR", {
      fieldErrors: {
        umsRollNumber: ["Invalid roll number format"],
        section: ["Section is required"],
      },
    });

    const fieldErrors = extractFieldErrors(error);
    expect(fieldErrors.umsRollNumber).toBe("Invalid roll number format");
    expect(fieldErrors.section).toBe("Section is required");

    const message = getApiErrorMessage(error);
    expect(message).toBe("umsRollNumber: Invalid roll number format");
  });

  it("falls back to standard Error message or fallback text", () => {
    const stdError = new Error("Network timeout");
    expect(getApiErrorMessage(stdError)).toBe("Network timeout");

    expect(getApiErrorMessage(null, "Custom fallback")).toBe("Custom fallback");
  });

  it("triggers toast notifications correctly", () => {
    const error = new ApiClientError(403, "Origin not allowed", "CORS_NOT_ALLOWED");
    const toastResult = showApiErrorToast(error);
    expect(toastResult).toBe("Cross-origin request rejected by the server.");

    const successResult = showApiSuccessToast("Saved successfully");
    expect(successResult).toBe("Saved successfully");
  });
});
