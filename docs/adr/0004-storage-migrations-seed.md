# ADR 0004: Storage, migrations and seed strategy

## Status

Accepted. Amended 2026-06-04: primary database changed from PostgreSQL to SQLite for MVP; backlog and implementation tasks must use SQLite as the MVP baseline.

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
- поддерживать JSON/text fields where useful for before/after audit snapshots and import validation errors;
- работать с Node.js 24 + Fastify + TypeScript backend;
- быть простым для локального MVP-запуска без отдельного database server.

## Decision

Primary database for MVP: SQLite.

Database access and migrations:

- ORM/query layer: Prisma ORM for MVP application data access, using SQLite provider;
- migration tool: Prisma Migrate with committed SQL migration history;
- database file for local/dev MVP: `apps/backend/data/trends.sqlite` or another documented path configured through `DATABASE_URL`;
- SQLite foreign key enforcement must be enabled for application connections;
- Prisma schema and migrations live with the backend/database package;
- custom SQL is allowed inside reviewed migration files for indexes, constraints, views or database features Prisma cannot express safely.

Seed strategy:

- seed data is not hidden inside schema migrations except for tiny static lookup defaults when unavoidable;
- seed source files are versioned separately from migrations;
- PDF seed must follow `docs/13-source-traceability.md`;
- seed runner is TypeScript and idempotent, using stable external/source keys and upsert semantics;
- seed records must preserve source fields: source PDF/raw reference, source number, department, quarter, owner, year, comment and known numbering gaps;
- after audit log exists, seed/import operations must write audit/import evidence instead of silently mutating published data.

Rollback strategy:

- production rollback is SQLite database file backup/restore plus forward-fix migration, not automatic destructive down migration;
- every production migration requires migration status check, backup point and post-migration verification;
- destructive migrations require explicit ADR/backlog note and data migration plan;
- failed Prisma migrations are resolved only through documented operational steps, not manual hidden edits.

## Alternatives Considered

### PostgreSQL

Pros:

- strong fit for concurrent corporate workflows, audit-heavy mutations and future import staging;
- rich operational tooling for backups, permissions, reporting and scaling;
- JSON fields and SQL features are useful for audit snapshots and validation errors.

Cons for this MVP:

- higher local setup cost and extra infrastructure dependency before core MVP workflows exist;
- requires Docker or a managed dev database for every contributor;
- premature for the current single-node MVP slice.

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
- good SQLite and PostgreSQL support.

Cons for this MVP:

- Prisma Migrate gives a more established migration/seed workflow for the initial team;
- Prisma's generated client is sufficient for the first MVP data access layer.

## Consequences

Positive:

- Data model can enforce references for core entities.
- Migrations are reviewable and committed.
- Seed import can preserve PDF traceability without mixing business data into schema evolution.
- Local development does not require a separate database server.
- SQLite text/JSON-style fields remain available for audit snapshots and validation errors, with application-level validation where needed.

Trade-offs:

- SQLite has lower concurrency headroom than PostgreSQL; this is acceptable for MVP but must be revisited before multi-team production scale.
- Database backup/restore is file-based in MVP and needs clear operational rules.
- Prisma schema is an additional source artifact that must stay aligned with ADRs and data model docs.
- Some complex reporting may eventually need SQL views or analytics-specific read models.
- Moving from SQLite to PostgreSQL later requires a separate ADR, migration plan, data export/import rehearsal and compatibility review.

## Implementation Notes

- The initial Prisma datasource should use `provider = "sqlite"` and a documented `DATABASE_URL`, for example `file:./data/trends.sqlite`.
- TR-203 should include migration status/check commands once backend tooling exists.
- TR-310/TR-311 should create seed source files before the seed loader.
- TR-312 implements idempotent seed loading with row-level validation and clear error reporting.
- TR-313 documents source traceability fields for affected tables.
- TR-125/TR-306 should define how seed/import/manual corrections appear in audit log.

## Sources

- SQLite documentation - https://www.sqlite.org/docs.html
- SQLite foreign key support - https://www.sqlite.org/foreignkeys.html
- Prisma Migrate CLI - https://www.prisma.io/docs/orm/reference/prisma-cli-reference
- Prisma Migrate getting started - https://www.prisma.io/docs/orm/prisma-migrate/getting-started
- Prisma seeding workflow - https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
