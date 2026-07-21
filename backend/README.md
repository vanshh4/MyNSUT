# MyNSUT Backend

REST API for the MyNSUT student platform.

## Stack

- Node.js and Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod validation
- Helmet, CORS, and Morgan

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- PostgreSQL 15 or newer

## Setup

1. Copy the environment template:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Update `DATABASE_URL`, `FRONTEND_URL`, and the Super Admin values in `.env`.

3. Install dependencies from the monorepo root:

   ```powershell
   npm install
   ```

4. Generate Prisma Client:

   ```powershell
   npm run prisma:generate --workspace backend
   ```

5. Create the initial migration:

   ```powershell
   npm run prisma:migrate --workspace backend -- --name init
   ```

6. Seed roles, permissions, and the optional Super Admin:

   ```powershell
   npm run db:seed --workspace backend
   ```

7. Start the backend:

   ```powershell
   npm run dev --workspace backend
   ```

The API will be available at `http://localhost:4000/api/v1`.

## Health endpoint

```text
GET /api/v1/health
```

Expected response:

```json
{
  "success": true,
  "message": "MyNSUT API is healthy",
  "data": {
    "status": "ok"
  }
}
```

## Scripts

- `npm run dev` — development server with reload
- `npm run build` — compile TypeScript
- `npm run start` — run compiled server
- `npm run typecheck` — check TypeScript without emitting files
- `npm run lint` — run ESLint
- `npm run format` — format supported files
- `npm run prisma:generate` — generate Prisma Client
- `npm run prisma:migrate` — create/apply development migrations
- `npm run prisma:deploy` — apply production migrations
- `npm run prisma:studio` — open Prisma Studio
- `npm run db:seed` — seed RBAC records and optional Super Admin

## Architecture

```text
src/
  config/       Environment and application configuration
  constants/    Role and permission identifiers
  controllers/  HTTP request handlers
  db/           Database client
  middlewares/  Cross-cutting Express middleware
  routes/       API route composition
  utils/        Reusable errors, responses, and handlers
  validations/  Shared Zod schemas
```

## Security notes

- Never commit `.env`.
- The frontend must never receive `DATABASE_URL` or OAuth client secrets.
- CORS is restricted to configured frontend origins.
- Error responses hide internal details in production.
- Role checks must eventually be enforced in backend middleware, not only in the frontend.
