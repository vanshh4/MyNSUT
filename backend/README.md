# MyNSUT Backend

Express, TypeScript, Prisma, and PostgreSQL API for MyNSUT.

## Phase 2 capabilities

- Native Google OpenID Connect authentication
- Authorization Code flow with state, nonce, and PKCE S256
- Verified `@nsut.ac.in` accounts only
- Database-backed opaque sessions
- SHA-256 session-token hashes
- Five-day sessions with sliding renewal when fewer than two days remain
- Maximum three active sessions per user; the oldest session is revoked automatically
- Current-device and all-device logout
- Student onboarding with UMS roll-number parsing
- Supported branch codes: `UCS`, `UIT`, `UIN`, `UBT`, `UEC`, and `UCM`
- Sections restricted to `1`, `2`, and `3`
- Existing-admin-created class required before onboarding
- `STUDENT` role assigned only after onboarding succeeds

## Requirements

- Node.js 20.9 or newer
- PostgreSQL
- Google OAuth web client
- Root npm workspace containing `frontend`, `backend`, and `shared`

## Install

Run from the monorepo root:

```powershell
npm install
npm run build --workspace @mynsut/shared
npm run prisma:generate --workspace backend
```

## Configure environment

Create the local environment file:

```powershell
Copy-Item backend\.env.example backend\.env
```

Generate `AUTH_SECRET`:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Set Google OAuth credentials and register this local authorized redirect URI:

```text
http://localhost:3000/api/backend/auth/google/callback
```

The Next.js application must proxy `/api/backend/*` to the backend `/api/v1/*` routes while preserving request headers, cookies, response status, redirects, and `Set-Cookie` headers.

## Database setup

Validate and generate Prisma Client:

```powershell
npm run prisma:validate --workspace backend
npm run prisma:generate --workspace backend
```

Create the Phase 2 migration:

```powershell
npm run prisma:migrate --workspace backend -- --name phase_2_auth_sessions_classes
```

Seed roles and permissions:

```powershell
npm run db:seed --workspace backend
```

## Create academic classes before onboarding

Phase 2 deliberately does not allow students to create classes. Until an admin class-management interface exists, create classes through Prisma Studio:

```powershell
npm run prisma:studio --workspace backend
```

Each class requires a unique combination of:

```text
admissionYear + branchCode + section
```

Example:

```text
name: 2023 UIT Section 2
admissionYear: 2023
branchCode: UIT
section: 2
status: ACTIVE
```

## Run

```powershell
npm run dev --workspace backend
```

Health endpoint:

```text
GET http://localhost:4000/api/v1/health
```

## Authentication endpoints

```text
GET  /api/v1/auth/google
GET  /api/v1/auth/google/callback
GET  /api/v1/auth/me
POST /api/v1/auth/session/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/logout-all
```

## Student endpoints

```text
GET  /api/v1/students/me
POST /api/v1/students/onboarding
```

Onboarding payload:

```json
{
  "umsRollNumber": "2023UIT3324",
  "section": "2"
}
```

## Validation

```powershell
npm run format --workspace backend
npm run lint --workspace backend
npm run typecheck --workspace backend
npm run build --workspace backend
```

## Production notes

- Use HTTPS.
- Set `TRUST_PROXY=true` on Render.
- Keep backend traffic behind the Next.js same-origin proxy.
- Use different OAuth clients and secrets for staging and production.
- Never commit `backend/.env`.
- Apply migrations with `npm run prisma:deploy --workspace backend` in deployment.
