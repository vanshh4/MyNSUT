export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;
  readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    options: { code?: string; details?: unknown; cause?: unknown; isOperational?: boolean } = {}
  ) {
    super(message, { cause: options.cause });
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = options.code ?? "API_ERROR";
    this.details = options.details;
    this.isOperational = options.isOperational ?? true;
    Error.captureStackTrace(this, this.constructor);
  }
}
