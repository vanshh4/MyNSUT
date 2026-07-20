# MyNSUT Shared Package

`@mynsut/shared` contains framework-independent contracts used by both the
Next.js frontend and Express backend.

## Contents

- Stable role identifiers
- Stable permission identifiers
- Role and permission type guards
- Standard API success/error response contracts
- Pagination contracts
- Common utility types

## Important boundary

Keep this package free from React, Next.js, Express, Prisma, browser APIs,
Node-only APIs, and business logic. Shared code should remain portable and
must not import from `frontend/` or `backend/`.

## Installation in the monorepo

The root `package.json` should include:

```json
{
  "private": true,
  "workspaces": ["frontend", "backend", "shared"]
}
```

From the repository root, run:

```powershell
npm install
npm run build --workspace @mynsut/shared
```

## Using the package

### Roles and permissions

```ts
import {
  PERMISSIONS,
  ROLES,
  type PermissionCode,
  type RoleCode,
} from "@mynsut/shared";
```

### API contracts

```ts
import type {
  ApiResponse,
  ApiSuccessResponse,
  PaginatedResponse,
} from "@mynsut/shared/types/api";
```

## Frontend dependency

Add this to `frontend/package.json`:

```json
{
  "dependencies": {
    "@mynsut/shared": "workspace:*"
  }
}
```

If the frontend consumes unbuilt TypeScript source in the future, add
`@mynsut/shared` to `transpilePackages` in `next.config.ts`. The current
package configuration exports compiled files from `dist/`, so build the
shared package before building the frontend.

## Backend dependency

Add this to `backend/package.json`:

```json
{
  "dependencies": {
    "@mynsut/shared": "workspace:*"
  }
}
```

Replace duplicated local role and permission constants with imports from
this package after the dependency is installed.

## Development commands

Run from the monorepo root:

```powershell
npm run build --workspace @mynsut/shared
npm run typecheck --workspace @mynsut/shared
npm run dev --workspace @mynsut/shared
```

`dev` runs TypeScript in watch mode and keeps `dist/` synchronized.

## Versioning rule

Role and permission string values may be persisted in PostgreSQL. Renaming
those values is a data migration, not a cosmetic refactor. Add new values
safely and coordinate any removal with database migrations and RBAC seeds.
