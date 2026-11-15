# MyNSUT — Security Model & Threat Assessment

## 1. Executive Summary

This document outlines the security architecture, threat model, trust boundaries, session lifecycle, and secret management policies for **MyNSUT**.

The primary objective is protecting student personal, academic, and identity data while providing a modern, reliable platform for Netaji Subhas University of Technology (NSUT). The security architecture enforces a strict **zero-trust model regarding the client**: all access controls, schema validations, and permission checks are enforced authoritatively on the backend Express application layer.

---

## 2. System Architecture & Trust Boundaries

MyNSUT operates across five distinct security zones with explicit trust boundaries between each layer:

```
[ End-User Browser ]
         │
         │  TLS 1.3 / HTTPS (Port 443)
         ▼
[ Boundary 1: Next.js Frontend (Vercel Edge / Reverse Proxy) ]
         │
         │  Same-Origin Proxy Rewrite: /api/backend/* -> /api/v1/*
         │  Preserves X-Forwarded-For, Host, and HttpOnly Cookies
         ▼
[ Boundary 2: Express Backend Application (Render PaaS) ]
         │
         ├───────────────────────────────┬───────────────────────────────┐
         │ TLS 1.3 (TCP 5432)            │ TLS 1.3 (TCP 6379)            │ HTTPS (Port 443)
         ▼                               ▼                               ▼
[ Boundary 3: Neon PostgreSQL ]   [ Boundary 4: Upstash Redis ]   [ Boundary 5: Google OIDC ]
  - Connection Pooler (Runtime)     - Tiered Rate Limit Store       - @nsut.ac.in SSO
  - Direct Connection (Migrate)     - Distributed Locks             - PKCE S256 Auth Code
```

### 2.1 Boundary 1: Browser to Next.js Frontend
- **Protocol**: HTTPS (TLS 1.3 enforced).
- **Surface**: Next.js 15 SSR and static assets.
- **Security Controls**:
  - Helmet-aligned HTTP headers (`HSTS`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`).
  - Same-origin reverse proxy: All API requests flow through `/api/backend/*` to prevent cross-origin cookie complexity and enable strict `SameSite=Lax` cookie retention.

### 2.2 Boundary 2: Next.js Proxy to Express Backend
- **Protocol**: HTTPS / internal VPC forwarding.
- **Trust Setting**: `app.set("trust proxy", env.TRUST_PROXY)` configured to resolve student IPs correctly behind reverse proxy layers.
- **Security Controls**:
  - Early `Content-Length` enforcement (`requestSize.middleware.ts`) rejecting payloads > 10MB prior to JSON parsing.
  - Tiered IP-based and user-based rate limiting (`rateLimit.middleware.ts`): API rate limits, strict auth limits (10/min), and mutation limits (30/min).
  - CSRF verification middleware (`csrf.middleware.ts`): Enforces matching `Origin` or `Referer` headers on all state-changing HTTP verbs (`POST`, `PUT`, `PATCH`, `DELETE`).
  - Structured Security Audit Logger (`securityEvents.service.ts`): Emits structured events with automated PII and credential redaction (`redactLogData.ts`).

### 2.3 Boundary 3: Express Backend to Neon PostgreSQL
- **Protocol**: TLS 1.3 with mandatory SSL mode (`sslmode=require`).
- **Separation of Concerns**:
  - **Runtime Querying**: Managed via Prisma Client using `DATABASE_URL` routed through Neon's serverless PgBouncer connection pooler for scalable connection handling.
  - **DDL & Migration**: Managed using `DIRECT_URL` pointing directly to the primary database instance to support advisory locks and transactional schema changes.
- **Data Protection**: Parameterized queries generated exclusively via Prisma ORM preventing SQL injection.

### 2.4 Boundary 4: Express Backend to Redis
- **Protocol**: TLS-encrypted Redis connection (`rediss://`).
- **Function**: Ephemeral rate limit counters, cache invalidation, and distributed locks. No long-term PII or session secrets are stored unhashed in Redis.

### 2.5 Boundary 5: Google Identity Provider (OIDC)
- **Protocol**: OpenID Connect over TLS.
- **Domain Constraint**: Strictly whitelists the university domain `@nsut.ac.in`. Personal `@gmail.com` or non-university accounts are rejected during code exchange.
- **OAuth Hardening**: Enforces PKCE (RFC 7636 with S256) and cryptographically random signed `state` and `nonce` cookies with 10-minute TTL.

---

## 3. Threat Model & Mitigations (STRIDE Framework)

| STRIDE Category | Potential Threat | MyNSUT Technical Mitigation |
| :--- | :--- | :--- |
| **Spoofing** | Attacker spoofs a student identity or bypasses login. | • Google OAuth 2.0 Authorization Code flow with PKCE S256.<br>• Strict verification of `@nsut.ac.in` email domain.<br>• Session tokens are 256-bit cryptographically secure random values; only SHA-256 hashes are persisted in the database.<br>• Cryptographically signed HTTP-only cookies prevent cookie tampering. |
| **Tampering** | Attacker modifies API requests or executes cross-site request forgery. | • CSRF verification on all mutations (`POST`, `PUT`, `PATCH`, `DELETE`) validating `Origin` and `Referer` headers against allowed origins.<br>• Strict runtime schema validation using Zod schemas on all endpoints.<br>• Parameterized queries via Prisma ORM prevent SQL parameter tampering. |
| **Repudiation** | An administrator or user denies executing a sensitive action. | • Immutable audit logging system (`securityEvents.service.ts`) capturing actor ID, timestamp, target resource, action type, IP address, and User-Agent.<br>• PII, session cookies, and credentials automatically scrubbed via `redactLogData.ts` before persistence. |
| **Information Disclosure** | Unauthorized users access peer academic summaries or PII. | • Strict projection filters: `PublicProfileProjection` strips CGPA, SGPA, roll numbers, or contact info unless explicitly permitted by the target student.<br>• Four independent student privacy settings (`bioVisibility`, `socialLinksVisibility`, `academicSummaryVisibility`, `semesterResultsVisibility`).<br>• Response redaction in error handlers hides internal database stack traces in production. |
| **Denial of Service** | Resource exhaustion via volumetric flooding or large payloads. | • Early request size limits (10MB maximum payload ceiling).<br>• Tiered distributed rate limiting (IP-based and session-based).<br>• FIFO session capping (maximum 3 concurrent active sessions per user).<br>• Connection pooling via Neon PgBouncer preventing DB exhaustion. |
| **Elevation of Privilege** | Student attempts administrative or CR operations. | • Authoritative server-side RBAC middleware (`requireRole`, `requirePermission`, `requireScope`).<br>• No authorization decisions made client-side.<br>• Scoped roles (`CLASS_CR`, `SOCIETY_PRESIDENT`) enforced with resource-level ownership validation. |

---

## 4. Session Architecture & Lifecycle Management

MyNSUT implements database-backed opaque sessions designed for high resistance to session hijacking and replay attacks:

```
[ Client Request ]
       │
       ▼
Cookie: mynsut_session=<raw_token> (256-bit random)
       │
       ▼
Express `authenticate` Middleware
       │
       ├─► Compute: hash = SHA-256(raw_token)
       ├─► DB Query: SELECT * FROM "Session" WHERE "tokenHash" = hash AND "revokedAt" IS NULL
       │
       ├─► Check: now() < session.expiresAt
       │
       ├─► Sliding Window Renewal:
       │     If (session.expiresAt - now()) < 2 Days:
       │        session.expiresAt = now() + 5 Days
       │
       └─► Inject: req.user = AuthenticatedUser
```

### 4.1 Cookie Security Policy
- `HttpOnly`: `true` (prohibits JavaScript access via `document.cookie`).
- `Secure`: `true` (enforces HTTPS transmission in production).
- `SameSite`: `"Lax"` (mitigates CSRF on cross-site navigations).
- `Path`: `"/"`.

### 4.2 Concurrency & Revocation
- **Max Sessions**: A maximum of 3 concurrent sessions per user. If a fourth session is created, the oldest active session is automatically revoked.
- **Individual Logout**: Sets `revokedAt = now()` on the specific session record and clears the cookie.
- **Global Logout**: Revokes all active sessions matching `userId`.

---

## 5. Role-Based Access Control (RBAC) Enforcement

The platform enforces a layered permission model:

1. **Global Roles (`RoleScope.GLOBAL`)**:
   - `SUPER_ADMIN`: Full administrative control across the platform.
   - `STUDENT`: Default baseline role for every verified university identity.
2. **Scoped Roles (`RoleScope.CLASS`, `RoleScope.SOCIETY`)**:
   - `CLASS_CR`: Class Representative scoped strictly to `classId`.
   - `SOCIETY_PRESIDENT` / `SOCIETY_MEMBER`: Scoped strictly to `societyId`.

### 5.1 Defense-in-Depth Middleware Pattern
Every protected endpoint in Express chains explicit guards:
```typescript
router.post(
  "/classes/:classId/announcements",
  authenticate,
  requireScope("CLASS", (req) => req.params.classId),
  requirePermission("CLASS_ANNOUNCEMENT_CREATE"),
  classAnnouncementsController.createAnnouncement
);
```

---

## 6. Secret Management & Rotation Procedures

### 6.1 Secret Inventory
| Secret Identifier | Usage | Storage Location | Rotation Cadence |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Neon pooled database connection string | Render / Hosting Environment Variables | 90 days / On Compromise |
| `DIRECT_URL` | Neon unpooled connection string for migrations | Render / CI Environment Variables | 90 days / On Compromise |
| `SESSION_SECRET` | Session hashing and signing salt | Render Environment Variables | 180 days |
| `COOKIE_SECRET` | Cookie signing key for OAuth state | Render Environment Variables | 180 days |
| `GOOGLE_CLIENT_SECRET` | Google Cloud OIDC credential | Render / Google Cloud Console | 365 days |
| `REDIS_URL` | Upstash Redis connection string | Render Environment Variables | 90 days / On Compromise |
| `SENTRY_DSN` | Application error telemetry | Render & Vercel Environment Variables | On Compromise |

### 6.2 Zero-Downtime Secret Rotation Runbook

#### A. Database Password Rotation (Neon)
1. In the Neon Console, create a secondary role or reset the password for the primary role.
2. Update `DATABASE_URL` and `DIRECT_URL` in Render environment settings.
3. Trigger a rolling zero-downtime deployment. Render boots the new instances with updated credentials while old instances drain connections.
4. Verify `/api/v1/health?readiness=true` returns 200 OK.
5. Invalidate the previous database password in Neon.

#### B. Cookie & Session Secret Rotation
1. Update `COOKIE_SECRET` and `SESSION_SECRET` in the hosting environment.
2. Re-deploy the backend service.
3. *Impact Assessment*: Users with in-flight OAuth attempts (<10 min) must restart login; existing valid sessions remain active if database-backed session hashes remain valid. If session token salts are rotated, all users will be required to re-authenticate via Google SSO once.

---

## 7. Incident Response & Security Vulnerability Reporting

1. **Detection**: Alerts triggered via Sentry, audit logs, or health check readiness probes.
2. **Containment**:
   - If an account is compromised: revoke all sessions via `DELETE /api/v1/admin/users/:userId/sessions` and mark account `SUSPENDED`.
   - If a vulnerability is detected: deploy emergency route disablement or maintenance mode via environment configuration.
3. **Disclosure Policy**: Security researchers and university members can report vulnerabilities to `security@mynsut.com` with a 48-hour response SLA.
