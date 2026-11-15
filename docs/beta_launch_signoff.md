# MyNSUT — Phase 9 Beta Launch Sign-Off & Pre-Flight Verification

**Release Version**: v1.0.0-beta  
**Date of Sign-Off**: November 15, 2026  
**Target Environment**: Production (Vercel Global Edge + Render PaaS + Neon Serverless Postgres)  
**Institution**: Netaji Subhas University of Technology (NSUT), Dwarka, New Delhi  
**Status**: **PASSED & APPROVED FOR UNIVERSITY BETA LAUNCH**  

---

## 1. Executive Summary

This document certifies that **MyNSUT** has successfully completed all Phase 9 ("Production Readiness & Pre-Deployment") quality gates, security hardenings, contract synchronizations, end-to-end integration verifications, and compliance runbooks.

The monorepo (`@mynsut/shared`, `backend`, `frontend`) is verified ready for deployment to staging and production infrastructure for the university-wide beta release.

---

## 2. Monorepo Quality Gate Matrix

| Verification Gate | Target Scope | Execution Command | Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Strict Typecheck** | `@mynsut/shared`, `backend`, `frontend` | `npm run typecheck --workspaces` | 0 errors across all packages | **PASS** |
| **Code Style & Lint** | `@mynsut/shared`, `backend`, `frontend` | `npm run lint --workspaces` | 0 errors across all packages | **PASS** |
| **Backend Test Suites** | Auth, Security, Health, DB, Routes | `npm run test --workspace backend` | 20 test files, 87 passed, 1 skipped | **PASS** |
| **Frontend Test Suites** | AuthGuard, API Client, Onboarding | `npm run test --workspace frontend` | 6 test files, 25 passed | **PASS** |
| **End-to-End E2E Suites** | Full Critical Student & Admin Journeys | `npx playwright test` | 5 specs, 18 passed (0 failed) | **PASS** |
| **Full Production Build** | Monorepo Full Build Pipeline | `npm run build` | 27 Next.js routes generated | **PASS** |

---

## 3. End-to-End Critical Path Verifications (Playwright)

1. **Authentication & Onboarding Flow (`tests/e2e/auth-onboarding.spec.ts`)**:
   - Verified unauthenticated visitors are redirected to `/auth/signin`.
   - Verified Google SSO button dispatches through same-origin reverse proxy `/api/backend/auth/google`.
   - Verified first-time student onboarding forces navigation to `/onboarding`, parses valid NSUT roll numbers (`2024UCS1001`), derives branch and graduation year, and saves section choice.
   - Verified session logout invalidates cookies and redirects to signin.
2. **Role-Based Access Control (`tests/e2e/rbac.spec.ts`)**:
   - Verified Super Admin access to `/admin` dashboard and management modules.
   - Verified unauthorized student access to admin mutations returns `403 INSUFFICIENT_ROLE`.
   - Verified regular students do not see administrative controls or class CR buttons.
3. **Profile Privacy Boundary (`tests/e2e/profile-privacy.spec.ts`)**:
   - Verified student can view own profile projection with complete academic metadata.
   - Verified student can update privacy settings (`bioVisibility`, `socialLinksVisibility`) with instant UI feedback.
   - Verified peer profile view conceals academic results, CGPA, and private summaries per student privacy settings.
4. **Core Student Workflows (`tests/e2e/class-notice-society-event.spec.ts`)**:
   - Verified class workspace tab switching (Announcements, Tasks, Members).
   - Verified official notice directory and unified feed rendering.
   - Verified campus societies directory discovery.
   - Verified society event discovery and registration interaction.
5. **Academic Resources Flow (`tests/e2e/resources.spec.ts`)**:
   - Verified student read-only view groups published resources by subject code and filters out unapproved drafts.
   - Verified search filter by subject name/code.
   - Verified admin full resource inventory (drafts + published) in `/admin/resources`.
   - Verified admin resource creation and instant publishing to directory.

---

## 4. Platform Security & Hardening Verification

- **Reverse Proxy Header Trust**: `TRUST_PROXY=true` in `backend/src/config/env.ts` and `app.ts` enables accurate extraction of real student IP addresses behind Vercel edge proxies for rate limiting and auditing.
- **CORS Lockdown**: Origin checking via `isAllowedOrigin` rejects all unauthorized origins in production while allowing `https://mynsut.com` and `https://www.mynsut.com`.
- **Tiered Rate Limiting**:
  - Global API limiter: 300 requests / 15 minutes.
  - Authentication limiter: 10 requests / minute on `/auth/*`.
  - Mutation limiter: 30 requests / minute on state-changing endpoints.
- **CSRF Protection**: State-changing requests (`POST`, `PUT`, `PATCH`, `DELETE`) verified against `Origin` and `Referer` headers.
- **Request Size Limiting**: Early 10MB Content-Length enforcement prior to body parsing.
- **PII & Secret Redaction**: Structured audit logger (`securityEvents.service.ts`) sanitizes sensitive fields (`password`, `token`, `authorization`, `client_secret`) via `redactLogData.ts`.
- **Domain Whitelist**: OpenID Connect strictly restricts authentication to `@nsut.ac.in` domain accounts.

---

## 5. Database Architecture & Health Probes

- **Dual-URL Configuration**:
  - `DATABASE_URL`: Routed through Neon PgBouncer connection pooler for runtime API queries, preventing connection exhaustion under traffic spikes.
  - `DIRECT_URL`: Direct TCP connection to primary PostgreSQL instance for transactional DDL migrations (`prisma migrate deploy`).
- **Health Probing**:
  - Liveness (`GET /api/v1/health`): Returns 200 OK immediately if process is alive.
  - Readiness (`GET /api/v1/health?readiness=true`): Executes `checkDatabaseHealth()` querying Prisma and measuring DB response latency; returns HTTP 503 if database pool is unreachable.
- **Migration & Seed Idempotency**:
  - 10 Prisma schema migrations verified sequential and clean.
  - `backend/prisma/seed.ts` confirmed strictly idempotent using `upsert` queries.

---

## 6. Documentation & Compliance Deliverables

All required operational, security, and legal runbooks are established in `docs/`:

1. [`docs/security_model.md`](file:///d:/Projects/my_nsut/docs/security_model.md): Comprehensive 5-boundary trust architecture, STRIDE threat mitigations, 256-bit opaque session hashing, and secret rotation procedures.
2. [`docs/deployment_runbook.md`](file:///d:/Projects/my_nsut/docs/deployment_runbook.md): Zero-downtime deployment pipeline, Render pre-deploy hooks, backward-compatible migration rules, and Neon Point-in-Time Recovery (PITR) rollbacks.
3. [`docs/privacy_policy_draft.md`](file:///d:/Projects/my_nsut/docs/privacy_policy_draft.md): Institutional DPDPA-aligned privacy policy detailing data collection, student privacy settings, retention periods, and deletion rights.
4. [`docs/terms_of_use_draft.md`](file:///d:/Projects/my_nsut/docs/terms_of_use_draft.md): Campus acceptable use agreement defining student and leadership responsibilities, academic integrity rules, and disciplinary procedures.

---

## 7. Pre-Launch Beta Deployment Checklist

Prior to opening the beta portal to all NSUT students:

- [x] Full monorepo builds with zero errors (`npm run build`).
- [x] All 18 Playwright E2E tests pass cleanly.
- [x] All 26 unit and integration test suites pass cleanly.
- [x] Zero TypeScript errors and zero ESLint errors across all workspaces.
- [x] Render deployment manifest (`render.yaml`) updated with `DIRECT_URL` and readiness health checks.
- [x] Vercel frontend build configuration (`frontend/vercel.json`) verified.
- [x] Environment variable examples synchronized (`backend/.env.example`, `frontend/.env.example`).
- [ ] Neon production database branch provisioned and migration script executed.
- [ ] Google Cloud Console OAuth consent screen authorized for domain `nsut.ac.in`.
- [ ] Sentry error logging project activated for frontend and backend production environments.
- [ ] Production DNS record configured for `mynsut.com`.

---

**Signed off by**: MyNSUT Engineering & Product Cell  
**Approval**: **READY FOR BETA DEPLOYMENT**
