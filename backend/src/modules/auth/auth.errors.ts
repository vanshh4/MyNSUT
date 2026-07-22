import { AUTH_ERROR_CODES, type AuthErrorCode } from "../../constants/auth.js";
import { ApiError } from "../../utils/apiError.js";

export class AuthError extends ApiError {
  constructor(statusCode: number, code: AuthErrorCode, message: string, details?: unknown) {
    super(statusCode, message, { code, details });
    this.name = "AuthError";
  }
}

export const authenticationRequired = () =>
  new AuthError(401, AUTH_ERROR_CODES.AUTHENTICATION_REQUIRED, "Authentication is required.");

export const invalidSession = () =>
  new AuthError(401, AUTH_ERROR_CODES.INVALID_SESSION, "The session is invalid or has been revoked.");

export const sessionExpired = () =>
  new AuthError(401, AUTH_ERROR_CODES.SESSION_EXPIRED, "The session has expired.");

export const accountSuspended = () =>
  new AuthError(403, AUTH_ERROR_CODES.ACCOUNT_SUSPENDED, "This account is suspended.");

export const accountDeleted = () =>
  new AuthError(403, AUTH_ERROR_CODES.ACCOUNT_DELETED, "This account is no longer available.");

export const onboardingRequired = () =>
  new AuthError(403, AUTH_ERROR_CODES.ONBOARDING_REQUIRED, "Student onboarding must be completed.");

export const insufficientRole = () =>
  new AuthError(403, AUTH_ERROR_CODES.INSUFFICIENT_ROLE, "The required role is not assigned.");

export const insufficientPermission = () =>
  new AuthError(
    403,
    AUTH_ERROR_CODES.INSUFFICIENT_PERMISSION,
    "The required permission is not assigned."
  );

export const invalidOAuthState = () =>
  new AuthError(400, AUTH_ERROR_CODES.INVALID_OAUTH_STATE, "The OAuth request is invalid or expired.");

export const invalidOAuthResponse = (details?: unknown) =>
  new AuthError(400, AUTH_ERROR_CODES.INVALID_OAUTH_RESPONSE, "Google returned an invalid response.", details);

export const googleAuthenticationFailed = (details?: unknown) =>
  new AuthError(401, AUTH_ERROR_CODES.GOOGLE_AUTHENTICATION_FAILED, "Google authentication failed.", details);

export const emailNotVerified = () =>
  new AuthError(403, AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED, "The Google email address is not verified.");

export const invalidEmailDomain = () =>
  new AuthError(403, AUTH_ERROR_CODES.INVALID_EMAIL_DOMAIN, "Use a verified @nsut.ac.in account.");

export const googleSubjectConflict = () =>
  new AuthError(
    409,
    AUTH_ERROR_CODES.GOOGLE_SUBJECT_CONFLICT,
    "This Google account is already linked to another user."
  );
