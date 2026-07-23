# MyNSUT Frontend

Next.js frontend for MyNSUT using the Motion Light design system.

## Phase 2 capabilities

- Google sign-in through the backend OAuth flow
- Same-origin API proxy through `/api/backend/*`
- Central `AuthProvider` and typed `useAuth` hook
- Guest and protected route guards
- Authentication callback and safe error pages
- UMS roll-number parsing preview
- Backend-connected onboarding
- Permission-aware navigation
- Current-device logout

## Setup

Run from the monorepo root:

```powershell
npm install
npm run build --workspace @mynsut/shared
Copy-Item frontend\.env.example frontend\.env.local
npm run dev --workspace frontend
```

The backend should run at `http://localhost:4000` and the frontend at `http://localhost:3000`.

## Environment

```env
NEXT_PUBLIC_APP_NAME="MyNSUT"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_BASE_URL="/api/backend"
BACKEND_INTERNAL_URL="http://localhost:4000"
```

`BACKEND_INTERNAL_URL` is server-only. Never expose backend secrets using a `NEXT_PUBLIC_` prefix.

## Route groups

Authentication pages should live under:

```text
src/app/(auth)/auth/signin/page.tsx
src/app/(auth)/auth/callback/page.tsx
src/app/(auth)/auth/error/page.tsx
src/app/(auth)/onboarding/page.tsx
```

Protected pages should live under:

```text
src/app/(protected)/dashboard/page.tsx
src/app/(protected)/profile/me/page.tsx
src/app/(protected)/notices/page.tsx
src/app/(protected)/societies/page.tsx
src/app/(protected)/events/page.tsx
src/app/(protected)/admin/page.tsx
```

Route groups do not change the public URLs.

## Important migration step

After moving each protected page, remove its page-level `AppShell` import and wrapper because `src/app/(protected)/layout.tsx` supplies the shell centrally.

## Validation

```powershell
npm run format --workspace frontend
npm run lint --workspace frontend
npm run build --workspace frontend
```

## OAuth callback

The Google OAuth client should register:

```text
http://localhost:3000/api/backend/auth/google/callback
```

The Next.js rewrite forwards that callback to the Express backend while preserving the browser-facing same origin.
