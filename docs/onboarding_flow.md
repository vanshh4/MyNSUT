# Phase 2 Student Onboarding Flow

## Purpose

Onboarding creates the verified student's academic identity after Google authentication.

## Preconditions

- The user has a valid session.
- The account is active.
- Onboarding is not already complete.
- A Super Admin has already created the target academic class.

## Input

```json
{
  "umsRollNumber": "2023UIT3324",
  "section": "2"
}
```

Sections are restricted to `1`, `2`, and `3`.

## Roll-number rule

```text
<four-digit admission year><branch code><numeric roll number>
```

Supported branches:

```text
UCS, UIT, UIN, UBT, UEC, UIC, UEE, UME, UCM
```

The backend normalizes input to uppercase, accepts admission years from 2020 through the current calendar year, calculates graduation year as `admissionYear + 4`, and leaves `currentSemester` null.

## Transaction

One Prisma transaction:

1. Resolves the pre-existing class by admission year, branch and section.
2. Creates the unique student record.
3. Sets `Student.classId`.
4. Marks `User.onboardingCompleted` true.
5. Assigns the global `STUDENT` role.

If any operation fails, all onboarding writes roll back.

## Rejections

- Invalid UMS format.
- Unsupported branch.
- Admission year outside the supported range.
- Invalid section.
- Duplicate UMS roll number.
- Existing student profile.
- Missing or archived academic class.

## Frontend behaviour

The frontend previews parsed details for immediate feedback, but backend validation remains authoritative. After success, `AuthProvider` refreshes `/auth/me` and redirects to `/dashboard`.
