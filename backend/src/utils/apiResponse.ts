export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export function apiResponse<T>(
  data: T,
  message = "Request completed successfully.",
  meta?: Record<string, unknown>
): ApiSuccessResponse<T> {
  return meta ? { success: true, message, data, meta } : { success: true, message, data };
}

export function apiErrorResponse(
  message: string,
  code: string = "INTERNAL_SERVER_ERROR",
  details?: unknown
) {
  return { success: false, message, error: { code, details } };
}
