# Implementation Plan: Corporate Trends Portal Implemented Baseline

**Branch**: `002-trends-portal-mvp` | **Date**: 2026-06-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-trends-portal-mvp/spec.md`

## Summary

Synchronize the Spec Kit plan with the code that is already implemented and working. The delivered baseline contains a closed-contour portal shell, technology trend list/detail UI, trend create/update backend behavior with reason-required audit, managed reference data APIs, local MVP actor/RBAC foundations, PDF seed publication for primary technology trends and strategic initiatives, and strategic initiative listing. Innovation registry, scoring, pilots, KPI dashboards, business cases, source registry/review, and employee "My Trends" are represented only as navigation or reference-data foundations unless implemented in a later slice.

## Technical Context

**Language/Version**: TypeScript application code; Node.js 24 LTS backend runtime; React frontend authored in TypeScript.

**Primary Dependencies**: Vite + React frontend, React Router, lucide-react icons, Fastify backend, Prisma ORM/Migrate, SQLite MVP storage, OpenAPI 3.0.3 contract package, generated TypeScript API types, Vitest, Playwright/browser verification for UI evidence, MOEX design system token/theme rules.

**Storage**: SQLite through Prisma ORM/Migrate. Implemented persisted entities include users, role assignments, employee profiles, departments, trend domains, trend statuses, innovation statuses, pilot statuses, maturity rings, trend recommendations, trends, strategic initiatives, and audit events.

**Testing**: Implemented baseline is covered by backend Vitest tests for app/health, reference data, current actor, RBAC, audit events, database helpers, seed loading/publication, strategic initiatives, and trends; root scripts also provide typecheck, build, lint, contract generation/check, seed checks, and database validation/status checks.

**Target Platform**: Closed corporate web portal MVP with local/dev monorepo execution. The closed portal does not depend on direct internet access.

**Project Type**: Web application with React SPA frontend, Fastify REST JSON backend, shared OpenAPI contract package, traceable seed data pipeline, and SQLite persistence.

**Performance Goals**: Implemented user-facing baseline should keep trend list/detail and initiative list usable for the current seed-sized dataset; success is measured by observable flows and validation checks rather than load/performance targets.

**Constraints**: Do not broaden this plan beyond implemented code. Manual correction with reason is implemented for trends and reference data. Seed source traceability is implemented for trends and strategic initiatives. Final scoring regulation is not implemented and must not be described as delivered. Future module pages are placeholders, not completed workflows. UI changes must follow MOEX design system rules.

**Scale/Scope**: Active delivered scope includes technology trends, reference data, local users/RBAC, audit, seed publication, strategic initiative listing, trend list/detail UI, and application shell. Future domains and innovation/pilot/status dictionaries exist as reference foundations, but business workflows for innovation, scoring, pilots, KPI/value, cases, sources, and My Trends are out of this implemented baseline.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Value-Led MVP Scope**: PASS. The plan is scoped to the already implemented technology-trends baseline and explicitly keeps innovation registry, scoring, pilots, KPI dashboards, business cases, source review, and employee "My Trends" workflows out of delivered scope unless implemented in a later slice.
- **Manual Control, Audit, And Traceability**: PASS. Trend and reference-data correction require reasons and write audit events; PDF seed publication preserves source traceability for trends and strategic initiatives, including the source numbering gap.
- **Delivery Discipline**: PASS. This synchronization is documentation/planning work only, records the implemented state, and defines validation/evidence tasks rather than new application behavior.
- **Stack And Architecture Boundaries**: PASS. The plan describes the existing React frontend, TypeScript/Fastify backend, SQLite/Prisma storage, REST/OpenAPI contract, and closed-contour MVP without introducing a new primary stack or direct internet dependency.
- **Employee, Company, And UX Value**: PASS. Employee and company value are represented honestly as implemented shell/navigation foundations and placeholder future routes; implemented UI validation remains tied to MOEX design system theme and browser checks.

## Project Structure

### Documentation (this feature)

```text
specs/002-trends-portal-mvp/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── openapi-mvp.yaml
│   └── ui-routes.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── app.ts
│       ├── modules/
│       │   ├── health/
│       │   ├── reference-data/
│       │   ├── seed/
│       │   ├── strategic-initiatives/
│       │   └── trends/
│       └── shared/
│           ├── api-errors.ts
│           ├── audit/
│           ├── auth/
│           ├── database/
│           └── rbac/
├── frontend/
│   └── src/
│       ├── App.tsx
│       ├── layout/
│       ├── pages/
│       │   ├── InitiativeListPage.tsx
│       │   ├── ModulePage.tsx
│       │   ├── TrendDetailPage.tsx
│       │   └── TrendListPage.tsx
│       ├── shared/api/
│       ├── styles/
│       └── theme/
packages/
└── api-contract/
    ├── openapi/openapi.yaml
    └── src/
data/
└── seed/
    ├── primary-technology-trends.seed.json
    ├── strategic-initiatives.seed.json
    └── generated/portal-seed.load.json
```

**Structure Decision**: Keep the existing monorepo layout. This synchronization does not create, move, or delete application code. Planning artifacts describe existing backend modules, frontend pages, OpenAPI contract, seed files, and Prisma schema.

## Complexity Tracking

No constitution violations or complexity exceptions are required.

## Phase 0: Research

Phase 0 output is captured in [research.md](./research.md). It records implemented-state decisions and explicitly separates delivered baseline from future modules.

## Phase 1: Design & Contracts

Phase 1 outputs synchronized to implemented code:

- [data-model.md](./data-model.md)
- [contracts/openapi-mvp.yaml](./contracts/openapi-mvp.yaml)
- [contracts/ui-routes.md](./contracts/ui-routes.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- **Value-Led MVP Scope**: PASS. `research.md`, `data-model.md`, contracts, and `quickstart.md` separate the implemented technology-trends baseline from future workflows.
- **Manual Control, Audit, And Traceability**: PASS. Design artifacts cover reason-required trend/reference mutations, AuditEvent, idempotent PDF seed publication, and source numbering preservation.
- **Delivery Discipline**: PASS. `tasks.md` is validation/evidence oriented, includes concrete file paths, and records that application code must not be changed during Spec Kit synchronization.
- **Stack And Architecture Boundaries**: PASS. Artifacts match the existing React/Vite frontend, TypeScript/Fastify backend, REST/OpenAPI contract, SQLite/Prisma storage, and local closed-contour MVP actor model.
- **Employee, Company, And UX Value**: PASS. UI route contracts and quickstart checks document implemented navigation, placeholder boundaries for My Trends/KPI/future modules, MOEX theme checks, and browser evidence expectations.
