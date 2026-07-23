# Phase 2 API Reference

Base path:

```text
/api/v1
```

Browser-facing path through Next.js:

```text
/api/backend
```

## Standard success response

```json
{
  "success": true,
  "message": "Request completed successfully.",
  "data": {}
}
```

## Standard error response

```json
{
  "success": false,
  "message": "Authentication is required.",
  "error": {
    "code": "AUTHENTICATION_REQUIRED",
    "requestId": "uuid"
  }
}
```

## Authentication endpoints

### `GET /auth/google`

Starts Google authentication and redirects to Google.

### `GET /auth/google/callback`

Validates the OAuth callback, issues the session cookie and redirects to `/auth/callback` or `/auth/error?code=...`.

### `GET /auth/me`

Requires a valid session. Returns the safe authenticated user, roles, permissions and optional student profile. Sliding renewal may update the session cookie.

### `POST /auth/session/refresh`

Explicitly validates the session. Normal page loads should use `/auth/me` instead.

### `POST /auth/logout`

Revokes the current session and clears the browser cookie.

### `POST /auth/logout-all`

Revokes every session for the current user and clears the browser cookie.

## Student endpoints

### `POST /students/onboarding`

Requires authentication but not completed onboarding.

Request:

```json
{
  "umsRollNumber": "2023UIT3324",
  "section": "2"
}
```

Response data:

```json
{
  "student": {
    "id": "uuid",
    "userId": "uuid",
    "classId": "uuid",
    "umsRollNumber": "2023UIT3324",
    "admissionYear": 2023,
    "branchCode": "UIT",
    "branchName": "Information Technology",
    "rollNumber": "3324",
    "section": "2",
    "graduationYear": 2027,
    "currentSemester": null
  },
  "onboardingCompleted": true
}
```

### `GET /students/me`

Requires authentication and completed onboarding. Returns the current student profile.

## Important error codes

```text
AUTHENTICATION_REQUIRED
INVALID_SESSION
SESSION_EXPIRED
ACCOUNT_SUSPENDED
ACCOUNT_DELETED
ONBOARDING_REQUIRED
ONBOARDING_ALREADY_COMPLETED
INVALID_OAUTH_STATE
GOOGLE_AUTHENTICATION_FAILED
EMAIL_NOT_VERIFIED
INVALID_EMAIL_DOMAIN
GOOGLE_SUBJECT_CONFLICT
INVALID_UMS_ROLL_NUMBER
UNSUPPORTED_BRANCH_CODE
INVALID_ADMISSION_YEAR
INVALID_SECTION
ROLL_NUMBER_ALREADY_REGISTERED
CLASS_NOT_AVAILABLE
STUDENT_PROFILE_NOT_FOUND
```

## Status conventions

- `400`: invalid request or validation failure.
- `401`: missing, invalid or expired authentication.
- `403`: suspended/deleted account, onboarding requirement, role or permission failure.
- `404`: missing resource.
- `409`: duplicate record, repeated onboarding or missing class prerequisite.
- `500`: unexpected server failure.
