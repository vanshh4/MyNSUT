# MyNSUT — Production Deployment & Operational Runbook

## 1. Overview & Deployment Topology

This runbook defines the operational procedures for deploying, maintaining, migrating, and rolling back the **MyNSUT** monorepo in production for the university-wide beta launch.

```
┌────────────────────────────────────────────────────────┐
│                   Vercel Global Edge                   │
│   Frontend: Next.js 15 (SSR / React Server Components)  │
│   Rewrites: /api/backend/:path*  ──► Render Backend     │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ HTTPS (TLS 1.3)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Render Web Service                   │
│   Backend: Express API (Node.js 20 LTS pinned)          │
│   Pre-Deploy Hook: npx prisma migrate deploy           │
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

---

## 2. Infrastructure Inventory & Environment Variables

### 2.1 Backend Environment (`backend/.env`)
| Variable | Description | Example / Format |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment indicator | `production` |
| `PORT` | Local binding port on host | `4000` (Render defaults to `10000`) |
| `DATABASE_URL` | Neon pooled connection string | `postgres://user:pass@ep-xyz-pooler.neon.tech/neondb?sslmode=require` |
| `DIRECT_URL` | Neon direct connection string (migrations) | `postgres://user:pass@ep-xyz.neon.tech/neondb?sslmode=require` |
| `COOKIE_SECRET` | 32+ char key for signing OAuth cookies | `cryptographically-random-hex-32-bytes` |
| `SESSION_SECRET` | 32+ char salt for session token hashing | `cryptographically-random-hex-32-bytes` |
| `CORS_ORIGIN` | Allowed origin for frontend requests | `https://mynsut.com` |
| `FRONTEND_URL` | Base URL of frontend application | `https://mynsut.com` |
| `GOOGLE_CLIENT_ID` | Google OAuth Web Application Client ID | `*.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-...` |
| `GOOGLE_REDIRECT_URI` | Public callback URL through frontend proxy | `https://mynsut.com/api/backend/auth/google/callback` |
| `TRUST_PROXY` | Proxy trust setting for Express | `true` |
| `REDIS_URL` | Upstash Redis connection string (optional) | `rediss://default:token@xyz.upstash.io:6379` |
| `SENTRY_DSN` | Sentry telemetry ingestion endpoint | `https://key@sentry.io/project` |

### 2.2 Frontend Environment (`frontend/.env`)
| Variable | Description | Example / Format |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment indicator | `production` |
| `PORT` | Local binding port | `3000` |
| `NEXT_PUBLIC_APP_URL` | Public site URL | `https://mynsut.com` |
| `NEXT_PUBLIC_API_BASE_URL` | Same-origin API prefix | `https://mynsut.com/api/backend` |
| `BACKEND_INTERNAL_URL` | Destination host for proxy rewrites | `https://api.mynsut.com` |

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
Before triggering production deployment, execute the complete test suite:
```bash
# 1. Typecheck all workspaces
npm run typecheck --workspaces

# 2. Run lint checks
npm run lint --workspaces

# 3. Run unit and integration tests
npm run test --workspace backend
npm run test --workspace frontend

# 4. Run End-to-End browser verification
npx playwright test
```

#### 2. Database Migrations (Render Pre-Deploy Hook)
In Render's service configuration (`render.yaml`), specify:
```yaml
preDeployCommand: "npm run prisma:deploy"
```
This runs `prisma migrate deploy` inside `backend/` using `DIRECT_URL`. It guarantees migrations complete before any new web server code starts listening for user traffic.

#### 3. Backend Health Probing
Render's health check path must be configured to:
```
/api/v1/health?readiness=true
```
- **Liveness probe** (`/api/v1/health`): Returns 200 immediately if Node process is healthy.
- **Readiness probe** (`/api/v1/health?readiness=true`): Executes `checkDatabaseHealth()` against Prisma. If the database pool is exhausted or unreachable, it returns HTTP 503, preventing Render from routing student traffic to an unready container.

#### 4. Frontend Release
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

### 4.2 Seed Idempotency
`backend/prisma/seed.ts` is strictly idempotent:
- Uses `upsert` queries for system roles, permissions, administrative users, initial branches, and demo societies.
- Safe to run on every clean environment or staging branch without creating duplicate records or throwing foreign key collisions.

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

### 5.1 Scenario A: Frontend Application Regression
*Symptoms: UI rendering bugs, hydration mismatch, client-side routing errors.*
- **Action**: In the Vercel Dashboard, select the previous stable deployment and click **"Promote to Production"**.
- **Execution Time**: Under 10 seconds. No rebuild or database modification required.

### 5.2 Scenario B: Backend Application Bug
*Symptoms: Elevated HTTP 500 errors in Sentry, unexpected API rejections.*
- **Action**: In the Render Dashboard, open the **Deploys** tab and select **"Rollback"** to the previous successful commit.
- **Execution Time**: ~60–90 seconds while containers swap.

### 5.3 Scenario C: Database Migration Failure or Data Corruption
*Symptoms: Failed DDL migration in pre-deploy hook or data inconsistency.*
1. **Immediate Action**: If a migration fails in the pre-deploy hook, Render automatically aborts the deployment and leaves the current live instances running untouched.
2. **Neon Point-in-Time Recovery (PITR)**:
   - If data corruption occurred, navigate to the Neon Console -> **Backups / Timeline**.
   - Restore the database to any state down to the exact second prior to the migration execution.
   - Neon instantly provisions the restored state to a recovery branch. Update `DATABASE_URL` and `DIRECT_URL` to point to the restored branch.

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
| **API Error Rate (5xx)** | > 1.0% over 5 minutes | Inspect Sentry logs, check database connection limits. |
| **Readiness Latency** | > 500ms over 3 minutes | Verify Neon CPU autoscaling and PgBouncer connection queue. |
| **Rate Limit Triggers** | > 100 blocks / hour | Inspect `securityEvents` audit log for brute-force or crawling activity. |
| **Active Sessions** | Sudden spike > 300% | Check for potential credential stuffing or session replay attacks. |

---

## 7. Pre-Launch Beta Deployment Checklist

- [ ] All 10 Prisma schema migrations applied cleanly via `DIRECT_URL`.
- [ ] Seed script (`prisma/seed.ts`) executed successfully on staging database.
- [ ] Google Cloud OAuth consent screen configured with authorized domain `nsut.ac.in` and production redirect URI.
- [ ] `TRUST_PROXY=true` confirmed in backend environment.
- [ ] `CORS_ORIGIN` set strictly to `https://mynsut.com` (no wildcards).
- [ ] Helmet security headers, CSP, and HSTS verified active.
- [ ] Rate limits verified on `/auth/*` and mutation routes.
- [ ] Automated daily database snapshots confirmed in Neon console.
- [ ] Sentry error logging initialized for both frontend and backend.
- [ ] 18 / 18 Playwright E2E tests passing against production build.
