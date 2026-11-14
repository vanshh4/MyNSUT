import { toast } from "react-hot-toast";

import { isApiClientError } from "./client";

export interface ValidationDetails {
  formErrors?: string[];
  fieldErrors?: Record<string, string[]>;
}

/**
 * Extracts a human-readable, user-friendly error message from any caught error,
 * prioritizing backend ApiClientError codes and validation messages.
 */
export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "An unexpected error occurred. Please try again."
): string {
  if (isApiClientError(error)) {
    // Specific security and infrastructure error codes
    if (error.code === "RATE_LIMIT_EXCEEDED") {
      return "Too many requests. Please wait a moment before trying again.";
    }
    if (error.code === "CSRF_FORBIDDEN") {
      return "Session verification failed. Please refresh the page and try again.";
    }
    if (error.code === "PAYLOAD_TOO_LARGE") {
      return "The requested file or payload exceeds the maximum allowed size limit.";
    }
    if (error.code === "CORS_NOT_ALLOWED") {
      return "Cross-origin request rejected by the server.";
    }

    // Validation errors: extract first field error if present
    if (error.code === "VALIDATION_ERROR" && error.details && typeof error.details === "object") {
      const details = error.details as ValidationDetails;
      if (details.fieldErrors) {
        const firstEntry = Object.entries(details.fieldErrors).find(
          ([, msgs]) => Array.isArray(msgs) && msgs.length > 0
        );
        if (firstEntry) {
          const [field, msgs] = firstEntry;
          return `${field}: ${msgs[0]}`;
        }
      }
      if (details.formErrors && details.formErrors.length > 0) {
        return details.formErrors[0];
      }
    }

    if (error.message && error.message.trim().length > 0) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
}

/**
 * Extracts a dictionary of field -> message from a backend Zod validation error.
 */
export function extractFieldErrors(error: unknown): Record<string, string> {
  const result: Record<string, string> = {};

  if (!isApiClientError(error) || !error.details || typeof error.details !== "object") {
    return result;
  }

  const details = error.details as ValidationDetails;
  if (!details.fieldErrors) {
    return result;
  }

  for (const [key, msgs] of Object.entries(details.fieldErrors)) {
    if (Array.isArray(msgs) && msgs.length > 0 && typeof msgs[0] === "string") {
      result[key] = msgs[0];
    }
  }

  return result;
}

/**
 * Displays an error toast notification with normalized error text.
 */
export function showApiErrorToast(
  error: unknown,
  fallbackMessage = "An unexpected error occurred. Please try again."
): string {
  const message = getApiErrorMessage(error, fallbackMessage);
  return toast.error(message);
}

/**
 * Displays a success toast notification.
 */
export function showApiSuccessToast(message: string): string {
  return toast.success(message);
}
