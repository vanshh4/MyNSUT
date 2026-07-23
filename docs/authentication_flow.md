# Phase 2 Authentication Flow

## Overview

MyNSUT uses native Google OpenID Connect authentication with the Authorization Code flow. The backend adds `state`, `nonce`, and PKCE S256 protection, accepts only verified `@nsut.ac.in` identities, and creates database-backed opaque sessions.

## Sign-in sequence

1. The frontend sends the browser to `/api/backend/auth/google`.
2. The Next.js same-origin proxy forwards the request to `/api/v1/auth/google` on Express.
3. Express creates cryptographically random OAuth `state`, `nonce`, and PKCE verifier values.
4. Short-lived signed HTTP-only cookies retain the OAuth transaction values for ten minutes.
5. Google authenticates the user and redirects to `/api/backend/auth/google/callback`.
6. Express validates the callback state, exchanges the code, verifies the signed ID token, validates issuer, audience, expiry and nonce, and checks `email_verified`.
7. The normalized email must end in `@nsut.ac.in`.
8. The service finds the user by Google subject and email. A matching email with no Google subject is linked; conflicting subjects are rejected.
9. Suspended and soft-deleted users are denied access.
10. The backend creates a random opaque session token, stores only its SHA-256 hash, and sends the raw token in an HTTP-only cookie.
11. The frontend callback page loads `/auth/me` and redirects to onboarding or the dashboard.

## Session policy

- Lifetime: five days.
- Sliding renewal: only when fewer than two days remain.
- Maximum active sessions: three.
- Creating a fourth session revokes the oldest active session.
- Logout revokes the current session.
- Logout-all revokes every active session for the user.
- Stored metadata: IP address, User-Agent, creation time, last-used time, expiry time and revocation time.

## Same-origin proxy

Browser requests use `/api/backend/*`. Next.js rewrites those requests to the Express `/api/v1/*` API. This keeps browser-facing requests same-origin and allows `SameSite=Lax` cookies.

## Account-linking rules

- Existing verified email + null Google subject: link the subject.
- Google subject linked to another user: reject.
- Existing subject with a different email: reject.
- Suspended/deleted user: reject without recreating the account.

## Security boundaries

The frontend never receives Google access tokens, ID tokens, session-token hashes, OAuth client secrets, Google subjects, IP addresses or User-Agent session metadata. Backend authorization remains authoritative even when the frontend hides controls.
