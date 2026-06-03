# ADR 0004: Storage, migrations and seed strategy

## Status

Accepted

## Date

2026-06-03

## Backlog

TR-123: выбрать хранилище данных и стратегию миграций.

## Context

MVP должен хранить тренды, инновации, гипотезы, скоринги, пилоты, KPI/value metrics, source traceability, manual corrections and audit log. Эти данные сильно связаны между собой, требуют транзакций, фильтрации, истории изменений, seed import from PDF and future import staging.

Storage foundation должен:

- поддерживать relational integrity for core entities;
- сохранять auditability and source traceability;
- иметь проверяемую migration history;
- позволять idempotent seed from PDF/source docs;
- поддерживать JSON fields where useful for before/after audit snapshots and import validation errors;
- работать с Node.js 24 + Fastify + TypeScript backend.

## Decision

Primary database: PostgreSQL.

Database access and migrations:

- ORM/query layer: Prisma ORM for MVP application data access;
- migration tool: Prisma Migrate with committed SQL migration history;
- target PostgreSQL version: supported PostgreSQL major, initially PostgreSQL 17+; exact production minor is pinned by deployment/infra;
- Prisma schema and migrations live with backend/database package after TR-202 decides repository structure;
- custom SQL is allowed inside reviewed migration files for indexes, constraints, views or database features Prisma cannot express safely.

Seed strategy:

- seed data is not hidden inside schema migrations except for tiny static lookup defaults when unavoidable;
- seed source files are versioned separately from migrations;
- PDF seed must follow `docs/13-source-traceability.md`;
- seed runner is TypeScript and idempotent, using stable external/source keys and upsert semantics;
- seed records must preserve source fields: source PDF/raw reference, source number, department, quarter, owner, year, comment and known numbering gaps;
- after audit log exists, seed/import operations must write audit/import evidence instead of silently mutating published data.

Rollback strategy:

- production rollback is backup/restore plus forward-fix migration, not automatic destructive down migration;
- every production migration requires migration status check, backup point and post-migration verification;
- destructive migrations require explicit ADR/backlog note and data migration plan;
- failed Prisma migrations are resolved only through documented operational steps, not manual hidden edits.

## Alternatives Considered

### SQLite

Pros:

- very simple local setup;
- useful for some tests or prototypes.

Cons for this MVP:

- weaker fit for concurrent corporate workflows, audit-heavy mutations and future import staging;
- not the intended production database for the portal.

### MongoDB / document database

Pros:

- flexible documents for imported signals and draft data.

Cons for this MVP:

- core model is relational: trends, innovations, scoring, pilots, decisions, metrics and sources have explicit links;
- manual correction, audit and KPI reporting benefit from relational constraints and SQL queries.

### Drizzle ORM

Pros:

- TypeScript-native schema;
- SQL-like mental model;
- good PostgreSQL support.

Cons for this MVP:

- Prisma Migrate gives a more established migration/seed workflow for the initial team;
- Prisma's generated client is sufficient for the first MVP data access layer.

## Consequences

Positive:

- Data model can enforce references for core entities.
- Migrations are reviewable and committed.
- Seed import can preserve PDF traceability without mixing business data into schema evolution.
- PostgreSQL JSON fields remain available for audit snapshots and validation errors.

Trade-offs:

- Local development needs PostgreSQL, likely through Docker or a managed dev database.
- Prisma schema is an additional source artifact that must stay aligned with ADRs and data model docs.
- Complex reporting may eventually need SQL views/materialized views or analytics-specific read models.

## Implementation Notes

- TR-202 should decide package paths, but a likely shape is `apps/backend/prisma/schema.prisma`, `apps/backend/prisma/migrations/`, `apps/backend/prisma/seed.ts`.
- TR-203 should include migration status/check commands once backend tooling exists.
- TR-310/TR-311 should create seed source files before the seed loader.
- TR-312 should implement idempotent seed loading with row-level validation and clear error reporting.
- TR-313 should add source traceability fields to affected tables.
- TR-125/TR-306 should define how seed/import/manual corrections appear in audit log.

## Sources

- PostgreSQL versioning policy - https://www.postgresql.org/support/versioning/
- Prisma Migrate CLI - https://docs.prisma.io/docs/cli/migrate
- Prisma Migrate getting started - https://www.prisma.io/docs/orm/prisma-migrate/getting-started
- Prisma seeding workflow - https://docs.prisma.io/docs/orm/prisma-migrate/workflows/seeding
