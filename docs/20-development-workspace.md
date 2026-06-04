# Development Workspace

## Назначение

Документ фиксирует базовую структуру workspace для frontend/backend реализации MVP.

## Runtime

- Node.js: `>=24 <27`.
- Package manager: `pnpm@11.5.1`.
- Frontend decision: Vite + React + TypeScript SPA, ADR `docs/adr/0001-frontend-build-tool.md`.
- Backend decision: Node.js 24 LTS + Fastify + TypeScript, ADR `docs/adr/0002-backend-runtime-framework.md`.
- Storage decision: SQLite + Prisma ORM/Migrate for MVP, ADR `docs/adr/0004-storage-migrations-seed.md`.
- PostgreSQL is not part of the MVP workspace baseline; introducing it requires a separate ADR and migration/backlog update.

After installing Node.js 24 LTS, enable the package manager through Corepack:

```bash
corepack enable
corepack prepare pnpm@11.5.1 --activate
pnpm --version
```

## Structure

```text
apps/
  frontend/       React frontend skeleton
  backend/        Fastify backend skeleton
packages/
  api-contract/   Generated/shared API contract types, TR-204
data/
  seed/           Traceable PDF-derived seed source files
```

## Root Commands

Root scripts delegate to workspace packages and use `--if-present`, so they are safe before every package has its final scripts.

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
pnpm test
pnpm lint
pnpm contract:check
pnpm seed:check
pnpm seed:load
pnpm db:validate
pnpm db:generate
pnpm db:migrate:dev
pnpm db:migrate:status
```

Test evidence после задач фиксируется по `docs/21-test-evidence-format.md`.

## Notes

- Application code is intentionally not created in TR-202.
- TR-200 added frontend dependencies, Vite scripts, placeholder routes and MOEX token CSS.
- TR-201 added backend dependencies, Fastify app factory, `/api/v1/health` and a health endpoint test.
- TR-203 added ESLint and verified root lint/typecheck/test/build baseline.
- TR-204 added OpenAPI 3.0.3, generated TypeScript types, FE/BE contract usage and stale generated-type check.
- TR-205 extracted the frontend shell into layout/navigation/page components and verified desktop/mobile browser behavior.
- TR-206 centralized frontend theme shell state and verified light, dark, inverted-light and inverted-dark browser states.
- TR-313 added a seed source traceability contract and `pnpm seed:check`.
- TR-312 added a TypeScript seed loader and `pnpm seed:load`, generating `data/seed/generated/portal-seed.load.json` idempotently with 17 traceable records.
- TR-299 added SQLite/Prisma baseline in `apps/backend/prisma`, backend/root database scripts, `.env.example` with `DATABASE_URL`, gitignored SQLite database files and a helper that enables SQLite foreign key enforcement with `PRAGMA foreign_keys = ON`.
- TR-300 added the `TrendDomain` Prisma model and static SQLite migration seed: `technology` is active/visible for MVP, while `exchange_finance`, `product_client`, `regulatory`, `hr`, `resilience`, `macro_industry` and `esg` are inactive/hidden.
- TR-004 documented the domain enablement rule: future domains are enabled by controlled dictionary data changes, not schema migrations.
- TR-301 added the `Department` Prisma model and static SQLite migration seed for PDF departments `ITG`, `КСС` and `TKC`.
- TR-302 added `TrendStatus`, `InnovationStatus` and `PilotStatus` Prisma models with static SQLite migration seed matching the MVP trend, innovation and pilot pipeline statuses.
- TR-303 added `MaturityRing` and `TrendRecommendation` Prisma models with static SQLite migration seed for radar rings and trend recommendations.
- TR-304 added `User`, `RoleAssignment` and `EmployeeProfile` Prisma models for local MVP identity, scoped roles and employee-facing relevance data.
- TR-308 added shared Fastify API error handlers and OpenAPI `ApiErrorResponse` schemas for validation, access, not found, conflict and internal errors.
- TR-305 added scoped RBAC policy primitives and a Fastify preHandler factory for future CRUD/API routes.
- TR-306 added `AuditEvent` Prisma model, SQLite migration and audit event helper for transaction-scoped mutation logging.
- TR-307 added reason-required enforcement in the audit helper for correction/admin override/decision/delete/status change events.
- TR-309 added the Prisma 7 SQLite application client setup with `@prisma/adapter-better-sqlite3` and generated client output under backend `src`.
- TR-129 added ADR `0007` and local MVP current actor resolution through `X-Trends-Actor-Email`, backed by seeded SQLite user `admin@trends.local`.
- TR-002 added `/api/v1/reference-data/:dictionary` list/create/update/deactivate endpoints for managed dictionaries, protected mutations with current actor RBAC and writes reason-required audit events.
- TR-010 added the `Trend` Prisma model and `/api/v1/trends` list/get/create/update API for trend cards with dictionary references, owner, review date, status, RBAC and audit trail.
- TR-014 verified the mandatory trend domain invariant through `Trend.domain_id NOT NULL`, required API/OpenAPI `domainCode` and backend route tests.
- TR-016 verified the closed-contour MVP path for manually created/edited `technology` trends; trend audit events remain `source=manual` and do not depend on external collectors.
- TR-011 added backend trend list filters for `domainCode`, `statusCode`, `ownerId` and `departmentId`, exposed through OpenAPI for future URL-backed React list views.
- TR-320 added the React `/trends` list view with URL-backed filters, loading/error/empty states and Vite `/api` proxy to the local Fastify backend; browser screenshots checked light, dark and inverted contexts.
- TR-321 added the React `/trends/:id` detail view with linked list rows, source traceability visibility and empty related innovations/pilots/metrics sections; browser screenshots checked light, dark and inverted contexts.
- TR-022 published PDF seed data into local SQLite through `seed:publish`: 10 technology trends are visible in `/trends` with source numbers `1,2,3,4,5,6,7,8,10,11`, 7 strategic initiatives are visible in `/innovations` with source numbers `1..7`, and seed audit events exist for all 17 published records.
- Backend Vitest runs with `--fileParallelism=false` because SQLite write tests share one local database and parallel file execution can produce `SQLITE_BUSY`.
