# MyNSUT — Production Deployment & Operational Runbook

## 1. Overview & Deployment Topology

This runbook defines the operational procedures for deploying, maintaining, migrating, and rolling back the **MyNSUT** monorepo in production for the university-wide beta launch.

```
┌────────────────────────────────────────────────────────┐
│                   Vercel Global Edge                   │
│   Frontend: Next.js 16 (SSR / React Server Components) │
│   Host: https://<project>.vercel.app (or custom domain)│
│   Rewrites: /api/backend/:path*  ──► Render Backend    │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ HTTPS (TLS 1.3)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Render Web Service                   │
│   Backend: Express API (Node.js 20.18.0 pinned)        │
│   Host: https://mynsut-backend.onrender.com            │
│   Pre-Deploy Hook: npm run prisma:deploy               │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
  DATABASE_URL│(Pooler :6543)    DIRECT_URL│(Direct :5432)
              ▼                           ▼
┌────────────────────────────────────────────────────────┐
│                  Neon Serverless Postgres              │
│   - Runtime Queries: PgBouncer Pooled Connection        │
│   - Schema Migrations: Direct Unpooled TCP              │
│   - Storage: Serverless autoscaling with PITR          │
└────────────────────────────────────────────────────────┘
```

> [!NOTE]
> - **Domain Routing**: Initial production deployment uses the canonical Vercel-assigned domain (`https://<project>.vercel.app`). Mapping an institutional custom domain (`https://mynsut.com`) can be configured at any point post-launch by adding the domain in Vercel, updating `FRONTEND_URL` on Render, and updating Google OAuth Authorized Redirect URIs with zero codebase modifications.
> - **Backend Runtime**: The backend Express service runs on Node.js 20.18.0 (currently pinned; runtime upgrade to a supported LTS version pending).

---

## 2. Infrastructure Inventory & Environment Variables

### 2.1 Backend Environment (`backend/.env` / Render Dashboard)
*Runtime: Node.js 20.18.0 (currently pinned; runtime upgrade to a supported LTS version pending)*
| Variable | Description | Example / Production Setting |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment indicator | `production` |
| `PORT` | Local binding port on host | `4000` (Render defaults to `10000`) |
| `API_PREFIX` | Base REST route prefix | `/api/v1` |
| `APP_NAME` | Service identifier | `MyNSUT API` |
| `LOG_LEVEL` | Morgan logging format | `combined` |
| `TRUST_PROXY` | Extract real client IPs behind Vercel/Render proxies | `true` |
| `DATABASE_URL` | Neon pooled connection string (PgBouncer) | `postgresql://user:pass@ep-xyz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |
| `DIRECT_URL` | Neon direct connection string (Prisma migrations) | `postgresql://user:pass@ep-xyz.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |
| `AUTH_SECRET` | 32+ character cryptographic secret for session signing | `cryptographically-random-hex-32-bytes` (Render "Generate") |
| `FRONTEND_URL` | Allowed frontend origins (comma-separated for previews) | `https://<your-project>.vercel.app` (or `https://<your-project>.vercel.app,https://mynsut.com`) |
| `GOOGLE_CLIENT_ID` | Google OAuth Web Application Client ID | `*.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-...` |
| `GOOGLE_CALLBACK_URL` | OAuth redirect URI through frontend proxy | `https://<your-project>.vercel.app/api/backend/auth/google/callback` |
| `FRONTEND_AUTH_SUCCESS_URL`| Post-login frontend callback route | `https://<your-project>.vercel.app/auth/callback` |
| `FRONTEND_AUTH_FAILURE_URL`| Post-login error display route | `https://<your-project>.vercel.app/auth/error` |
| `SESSION_COOKIE_NAME` | Name of the secure HTTP-only session cookie | `mynsut_session` |
| `REDIS_URL` | Upstash Redis connection string (optional) | `rediss://default:token@xyz.upstash.io:6379` |
| `SENTRY_DSN` | Sentry telemetry ingestion endpoint (optional) | `https://key@sentry.io/project` |

### 2.2 Frontend Environment (`frontend/.env` / Vercel Dashboard)
| Variable | Description | Example / Production Setting |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_NAME` | Public application branding name | `MyNSUT` |
| `NEXT_PUBLIC_APP_URL` | Canonical public URL of the frontend app | `https://<your-project>.vercel.app` |
| `NEXT_PUBLIC_API_BASE_URL` | Same-origin API prefix for browser fetch calls | `/api/backend` |
| `BACKEND_INTERNAL_URL` | Destination host for proxy rewrites (**mandatory in production**; localhost rejected) | `https://mynsut-backend.onrender.com` |

---

## 3. Zero-Downtime Deployment Lifecycle

To achieve zero downtime during updates and database migrations, deployments MUST follow this ordered pipeline:

```
[ Step 1: Quality Gate & Automated Tests (CI) ]
                     │
                     ▼
[ Step 2: Render Pre-Deploy Command: prisma migrate deploy ]
  - Uses DIRECT_URL (bypasses PgBouncer)
  - Applies forward-compatible migrations
                     │
                     ▼
[ Step 3: Backend Rolling Deployment (Render) ]
  - Boots new container instance
  - Waits for /api/v1/health?readiness=true == 200 OK
  - Drains connections from old instance
                     │
                     ▼
[ Step 4: Frontend Atomic Release (Vercel) ]
  - Builds Next.js production bundle
  - Updates routing alias atomically to new deployment
                     │
                     ▼
[ Step 5: Post-Deployment Smoke Verification ]
  - Verifies auth callback, profile, class, and resources feeds
```

### 3.1 Step-by-Step Production Release Execution

#### 1. Pre-Deployment Quality Gate (Local / CI)
Before triggering production deployment, execute the complete monorepo quality gate:
```bash
# 1. Typecheck all workspaces (@mynsut/shared, backend, frontend)
npm run typecheck

# 2. Run lint checks across all workspaces
npm run lint

# 3. Run unit and integration tests across backend and frontend
npm run test

# 4. Run End-to-End browser verification (optional pre-flight)
npm run test:e2e
```

#### 2. Database Migrations (Render Pre-Deploy Hook)
In Render's service configuration (`render.yaml`), specify:
```yaml
preDeployCommand: npm run prisma:deploy --workspace backend
```
This runs `prisma migrate deploy` inside `backend/` using `DIRECT_URL` (direct unpooled TCP connection to port 5432). It guarantees migrations complete before any new web server code starts listening for user traffic.

#### 3. Initial Database Seeding (One-Time Manual Operation)
Database seeding (`backend/prisma/seed.ts`) is intentionally **decoupled from routine deployments**:
* **Why Decoupled**:
  1. *Deployment Latency*: Upserting hundreds of cohort classes, branches, sections, and demo subjects adds significant pre-deploy overhead, slowing rolling updates.
  2. *Data Re-creation Risk*: `seed.ts` populates sample academic resources (PYQs and notes); running seed automatically on every deploy would resurrect demo resources that administrators deliberately removed or updated in production.
  3. *Constraint Collision Hazard*: Live administrative modifications to classes or subjects could collide with hardcoded seed definitions, aborting routine releases.
* **When to Seed**: Execute exactly **once** upon initial launch to a fresh database branch to establish system roles, permissions, baseline classes, default subjects, and the optional Super Admin.
* **Mandatory Preconditions & Operational Protocol**:
  1. **Verify Target Database Connection**: Verify that the backend is connected to the intended production Neon database host and endpoint (`ap-southeast-1.aws.neon.tech`).
  2. **Confirm Migrations Complete**: Confirm that all Prisma migrations have completed successfully (`npm run prisma:deploy --workspace backend`) before running the seed.
  3. **Verify Environment Isolation**: Verify that the target database is the dedicated production database and NOT a local development, test, or preview database.
  4. **Execute Seed Command**: Run the seed command via Render Dashboard Shell (Option A) or via controlled CLI with production credentials (Option B).
  5. **Verify Resulting Logs & Baseline Data**: Confirm that the seed script outputs `"MyNSUT Phase 9 baseline seed completed successfully."` and verify that baseline roles, permissions, branches, sections, and cohort classes are present.
  6. **Record Completion**: Document in deployment records that initial production seeding has been completed (including timestamp, operator, and Neon database branch ID).
* **Rerun Safety Policy**:
  - The seed script should **only be rerun after reviewing its behavior and confirming that rerunning it is safe** for the current database state (e.g., verifying that custom administrative modifications, live timetable entries, or pruned sample resources will not be unintentionally overwritten or re-created).
* **How to Execute Initial Seed**:
  * **Option A (Recommended — Render Dashboard Shell)**:
    1. Navigate to [Render Dashboard](https://dashboard.render.com) &rarr; select **`mynsut-backend`**.
    2. Open the **Shell** tab.
    3. Execute:
       ```bash
       npm run db:seed --workspace backend
       ```
    4. Confirm log output: `"MyNSUT Phase 9 baseline seed completed successfully."`
  * **Option B (Remote CLI with Production Credentials)**:
    ```bash
    DATABASE_URL="<neon-pooled-url>" DIRECT_URL="<neon-direct-url>" npm run db:seed --workspace backend
    ```

#### 4. Backend Health Probing
Render's health check path must be configured to:
```
/api/v1/health?readiness=true
```
- **Liveness probe** (`/api/v1/health`): Returns 200 immediately if Node process is healthy.
- **Readiness probe** (`/api/v1/health?readiness=true`): Executes `checkDatabaseHealth()` against Prisma. If the database pool is exhausted or unreachable, it returns HTTP 503, preventing Render from routing student traffic to an unready container.

#### 5. Frontend Release
Pushing to the production branch (`main`) automatically triggers Vercel's atomic build. Assets are distributed globally across Vercel's CDN Edge.

---

## 4. Neon Database Migration Guidelines

### 4.1 Golden Rule: Backward-Compatible Migrations
Because old and new backend application instances coexist during a rolling deployment, **database migrations must always be backward-compatible with the immediately preceding code release**:

1. **Phase 1: Expand (Release N)**
   - Add nullable or default-valued columns.
   - Add new tables or indexes.
   - Do NOT drop columns or tables.
   - Do NOT rename columns (add new column, sync data, deprecate old).
2. **Phase 2: Migrate Application Code (Release N+1)**
   - Deploy code that writes to the new schema and reads from the new schema with fallback.
3. **Phase 3: Contract (Release N+2)**
   - Once all traffic uses the new schema, remove deprecated columns or tables in a subsequent migration.

### 4.2 Seed Idempotency & Controlled Execution
`backend/prisma/seed.ts` is strictly idempotent:
- Uses `upsert` queries for system roles, permissions, administrative users, initial branches, and demo societies.
- Safe to run on clean environments or staging branches without creating duplicate records or throwing foreign key collisions.
- As noted in Section 3.1.3, routine deployments must not execute `db:seed` automatically; trigger only when provisioning clean databases or resetting staging instances.
- **Rerun Policy**: The seed script should only be rerun after reviewing its behavior and confirming that rerunning it is safe for the active dataset, ensuring live operational records or deleted sample data are not unintentionally disrupted.

### 4.3 Neon Database Branching for Migration Verification
Before running migrations on production, use Neon's branching feature to verify migrations safely:
```bash
# 1. Create a lightweight ephemeral clone of production in seconds
neon branches create --name migration-test

# 2. Point DIRECT_URL to the test branch and run:
npx prisma migrate deploy

# 3. Verify zero schema errors or constraint locks, then delete test branch:
neon branches delete migration-test
```

---

## 5. Rollback Procedures

> [!IMPORTANT]
> **Application Rollback vs. Database Rollback**:
> It is critical to distinguish between application code rollbacks and database schema/state rollbacks:
> - **Application Rollback (Vercel / Render)**: Reverts the running container or edge bundle to an earlier git commit. **Application rollback does NOT automatically reverse, down-migrate, or undo Prisma database migrations.**
>   - Because all production migrations MUST follow the backward-compatible expand-and-contract pattern (Section 4.1), an application rollback to the previous commit remains fully compatible with the newly migrated database schema.
> - **Database Rollback / Recovery (Neon PITR)**: Prisma does not generate automatic down-migrations. If a breaking schema change was introduced or data corruption occurred:
>   - **Neon Point-in-Time Recovery (PITR)** is a **database recovery mechanism, not an automatic application rollback mechanism**. It provisions a restored database branch to a precise timestamp prior to the failure, requiring manual updating of `DATABASE_URL` and `DIRECT_URL` in the Render environment.
>   - For code-managed schema rollbacks without PITR, engineer a new forward migration (`prisma migrate dev`) that drops or alters the problematic columns/tables, and deploy it through the standard pipeline.

### 5.1 Scenario A: Frontend Application Regression
*Symptoms: UI rendering bugs, hydration mismatch, client-side routing errors.*
- **Scope**: Frontend code only; zero database impact.
- **Action**: In the Vercel Dashboard, select the previous stable deployment and click **"Promote to Production"**.
- **Execution Time**: Under 10 seconds. No rebuild or database modification required.

### 5.2 Scenario B: Backend Application Bug
*Symptoms: Elevated HTTP 500 errors in Sentry or server logs, unexpected API rejections.*
- **Scope**: Backend API code only; database schema remains intact and unaffected.
- **Action**: In the Render Dashboard, open the **Deploys** tab and select **"Rollback"** to the previous successful commit.
- **Execution Time**: ~60–90 seconds while containers swap.

### 5.3 Scenario C: Database Migration Failure or Data Corruption
*Symptoms: Failed DDL migration in pre-deploy hook or data inconsistency.*
1. **Pre-Deploy Migration Failure**:
   - If a migration fails during the `preDeployCommand` hook, Render automatically halts the deployment pipeline. The existing running backend container is left untouched and continues serving traffic against the uncorrupted schema.
2. **Post-Deploy Data Corruption or Breaking Schema (Neon PITR Recovery)**:
   - When data corruption occurs or an unrecoverable schema error bypasses testing, use Neon PITR as a database disaster recovery mechanism:
   - Navigate to the **Neon Console** &rarr; **Backups / Timeline**.
   - Restore the database to any state down to the exact second prior to the incident.
   - Neon provisions the restored state to a new recovery branch. Update `DATABASE_URL` and `DIRECT_URL` in the Render environment settings to point to the restored branch.
   - Restart the Render web service to connect to the recovered database branch.

---

## 6. Operational Health Checks & Telemetry Monitoring

### 6.1 Diagnostic Endpoints
- `GET /api/v1/health`
  - Response: `{"status": "ok", "app": "MyNSUT API", "uptime": 1248.5}`
- `GET /api/v1/health?readiness=true`
  - Response (Healthy): `{"status": "ok", "ready": true, "database": {"connected": true, "latencyMs": 14}}`
  - Response (Unhealthy): HTTP 503 `{"status": "error", "ready": false, "database": {"connected": false, "error": "Connection timed out"}}`

### 6.2 Key Operational Metrics & Alert Thresholds
| Metric | Threshold | Investigation Action |
| :--- | :--- | :--- |
| **API Error Rate (5xx)** | > 1.0% over 5 minutes | Inspect server logs, verify Neon connection limits. |
| **Readiness Latency** | > 500ms over 3 minutes | Verify Neon CPU autoscaling and PgBouncer connection queue. |
| **Rate Limit Triggers** | > 100 blocks / hour | Inspect `securityEvents` audit log for brute-force or crawling activity. |
| **Active Sessions** | Sudden spike > 300% | Check for potential credential stuffing or session replay attacks. |

---

## 7. Pre-Launch Beta Deployment Checklist

- [ ] All 10 Prisma schema migrations applied cleanly via `DIRECT_URL`.
- [ ] Initial database seed preconditions verified (production database confirmed, migrations complete), executed once via Render Shell, and recorded.
- [ ] Google Cloud OAuth consent screen configured with authorized domain `nsut.ac.in` and production redirect URI matching Vercel host (`https://<project>.vercel.app/api/backend/auth/google/callback`).
- [ ] `BACKEND_INTERNAL_URL` configured in Vercel production environment pointing to live Render service (e.g. `https://mynsut-backend.onrender.com`).
- [ ] `TRUST_PROXY=true` confirmed in backend environment.
- [ ] `FRONTEND_URL` set strictly to authorized frontend origins (e.g. `https://<project>.vercel.app`).
- [ ] Helmet security headers, CSP, and HSTS verified active.
- [ ] Rate limits verified on `/auth/*` and mutation routes.
- [ ] Automated daily database snapshots confirmed in Neon console.
- [ ] Sentry error logging initialized for frontend and backend (optional; non-blocking).
- [ ] 18 / 18 Playwright E2E tests passing against production build.
