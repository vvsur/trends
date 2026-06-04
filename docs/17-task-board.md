# Task Board

## Назначение

Временная task board для командной работы в репозитории до подключения внешнего issue tracker. Product backlog остается в `docs/04-backlog.md`; здесь фиксируются текущий статус, исполнитель и движение задач.

## Статусы

Использовать статусы из `docs/16-team-workflow.md`:

- `Backlog`
- `Discovery`
- `Ready`
- `In Progress`
- `In Review`
- `Testing`
- `Done`
- `Blocked`
- `Deferred`
- `Cancelled`

## Board

| ID | Title | Status | Priority | Owner | Assignee | Updated at | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TR-100 | Подключить MOEX design system skills и закрепить правила UI-разработки | Done | P0 | TBD | Codex | 2026-06-03 | Done: `.skills` submodule подключен, обязательные skill-файлы проверены, `AGENTS.md` registry/rules обновлены |
| TR-110 | Закрепить правила формирования backlog и работы с задачами | Done | P0 | Product | Codex | 2026-06-03 | Зафиксировано в `docs/14-backlog-operating-model.md` |
| TR-111 | Закрепить обязательные skills/expertise для реализации портала | Done | P0 | Product | Codex | 2026-06-03 | Зафиксировано в `docs/15-required-expertise-and-skills.md` |
| TR-112 | Добавить рабочие правила для implementation agents | Done | P0 | Product | Codex | 2026-06-03 | Зафиксировано в `AGENTS.md` |
| TR-113 | Закрепить командный workflow статусов backlog | Done | P0 | Product | Codex | 2026-06-03 | Зафиксировано в `docs/16-team-workflow.md` |
| TR-114 | Вести task board для командной работы до подключения issue tracker | Done | P0 | Product | Codex | 2026-06-03 | Зафиксировано в `docs/17-task-board.md` |
| TR-115 | Сформировать полный implementation backlog по всей документации | Done | P0 | Product | Codex | 2026-06-03 | Зафиксировано в `docs/18-full-implementation-backlog.md` |
| TR-116 | Проверить покрытие всей документации задачами backlog | Done | P0 | Product | Codex | 2026-06-03 | Зафиксировано в `docs/19-backlog-coverage-review.md` |
| TR-102 | Зафиксировать и соблюдать ограничения стека: React frontend, TypeScript backend | Done | P0 | Architecture | Codex | 2026-06-03 | Зафиксировано в `docs/11-technology-stack.md` |
| TR-120 | Выбрать frontend build tool/framework поверх React | Done | P0 | Architecture | Codex | 2026-06-03 | Done: ADR `docs/adr/0001-frontend-build-tool.md`, выбран Vite + React + TypeScript SPA |
| TR-121 | Выбрать TypeScript backend runtime/framework | Done | P0 | Architecture | Codex | 2026-06-03 | Done: ADR `docs/adr/0002-backend-runtime-framework.md`, выбран Node.js 24 LTS + Fastify + TypeScript |
| TR-122 | Выбрать API style и контракт shared types | Done | P0 | Architecture | Codex | 2026-06-03 | Done: ADR `docs/adr/0003-api-style-shared-types.md`, выбран REST JSON + OpenAPI 3.0.3 + generated TS types |
| TR-123 | Выбрать хранилище данных и стратегию миграций | Done | P0 | Architecture/Data | Codex | 2026-06-04 | Done: ADR `docs/adr/0004-storage-migrations-seed.md`, выбран SQLite + Prisma ORM/Migrate for MVP |
| TR-128 | Перевести storage baseline и backlog с PostgreSQL на SQLite | Done | P0 | Architecture/Data | Codex | 2026-06-04 | Done: README, docs, ADR, task board and implementation backlog aligned to SQLite-only MVP baseline; no PostgreSQL baseline tasks remain |
| TR-124 | Определить RBAC и роли MVP | Done | P0 | Product/Security | Codex | 2026-06-03 | Done: ADR `docs/adr/0005-rbac-mvp.md`, scoped roles employee/trend_owner/expert/executive/admin |
| TR-125 | Определить формат audit log и versioning | Done | P0 | Architecture/Security | Codex | 2026-06-03 | Done: ADR `docs/adr/0006-audit-log-versioning.md`, AuditEvent + per-entity versioning |
| TR-129 | Определить MVP current actor/auth context | Done | P0 | Product/Security/Architecture | Codex | 2026-06-04 | Done: ADR `0007`; local MVP actor resolved by `X-Trends-Actor-Email`; seeded `admin@trends.local` global admin verified in SQLite; backend tests passed |
| TR-202 | Настроить monorepo/workspace или структуру FE/BE | Done | P0 | Architecture | Codex | 2026-06-03 | Done: pnpm workspace, apps/frontend, apps/backend, packages/api-contract, dev commands documented |
| TR-200 | Создать frontend skeleton на React | Done | P0 | Architecture/Frontend | Codex | 2026-06-03 | Done: Vite React skeleton, routes-заглушки, MOEX token CSS, typecheck/build/browser check |
| TR-201 | Создать backend skeleton на TypeScript | Done | P0 | Architecture/Backend | Codex | 2026-06-03 | Done: Fastify TypeScript skeleton, `/api/v1/health`, app factory test |
| TR-203 | Настроить lint/typecheck/test baseline | Done | P0 | Architecture/QA | Codex | 2026-06-03 | Done: ESLint baseline; root lint/typecheck/test/build pass |
| TR-204 | Настроить shared types/API contract baseline | Done | P0 | Architecture/API | Codex | 2026-06-03 | Done: OpenAPI 3.0.3 baseline, generated TS types, FE/BE type-only usage, stale check |
| TR-205 | Настроить базовый layout приложения | Done | P0 | Frontend | Codex | 2026-06-03 | Done: layout/navigation components extracted, MOEX token states aligned, desktop/mobile browser check |
| TR-206 | Настроить light/dark/inverted theme shell | Done | P0 | Frontend | Codex | 2026-06-03 | Done: centralized theme shell, localStorage persistence, color-scheme sync, 4-state browser check |
| TR-207 | Настроить начальный test evidence format | Done | P0 | QA | Codex | 2026-06-03 | Done: `docs/21-test-evidence-format.md` added and linked from DoD/workflow docs |
| TR-299 | Настроить SQLite/Prisma baseline | Done | P0 | Backend/Data | Codex | 2026-06-04 | Done: SQLite Prisma 7 config/schema, baseline migration, db scripts, `.env.example`, ignored db/generated files, FK helper; validate/generate/status/typecheck/build/backend tests passed |
| TR-300 | Реализовать справочник доменов трендов | Done | P0 | Backend/Data | Codex | 2026-06-04 | Done: `TrendDomain` model and SQLite migration seed added; 8 domain rows verified, `technology` active/visible, future domains inactive/hidden |
| TR-004 | Поэтапное включение доменов | Done | P0 | Product/Backend/Data | Codex | 2026-06-04 | Done: domain enablement rule documented; SQLite evidence confirms `technology` active/visible and 7 future domains inactive/hidden; migrate/status/typecheck/build/lint passed |
| TR-301 | Реализовать справочник департаментов | Done | P0 | Backend/Data | Codex | 2026-06-04 | Done: `Department` model and SQLite migration seed added; ITG, КСС, TKC verified active in local SQLite |
| TR-302 | Реализовать справочники статусов pipeline | Done | P0 | Backend/Data | Codex | 2026-06-04 | Done: `TrendStatus`, `InnovationStatus`, `PilotStatus` Prisma models and SQLite migration seed added; verified 4/8/7 rows; validate/generate/migrate/status/typecheck/build/backend tests/lint passed |
| TR-303 | Реализовать справочник maturity/recommendation | Done | P0 | Backend/Data | Codex | 2026-06-04 | Done: `MaturityRing` and `TrendRecommendation` Prisma models and SQLite migration seed added; verified 5/5 rows; validate/generate/migrate/status/typecheck/build/backend tests/lint passed |
| TR-304 | Реализовать User/EmployeeProfile модель | Done | P0 | Backend/Data/Security | Codex | 2026-06-04 | Done: `User`, `RoleAssignment`, `EmployeeProfile` Prisma models and SQLite migration added; profile stores role, department, skills/interests/subscriptions as JSON text; validate/generate/migrate/status/typecheck/build/backend tests/lint passed |
| TR-308 | Реализовать базовые API error conventions | Done | P0 | Backend/API | Codex | 2026-06-04 | Done: Fastify error/not-found handlers, `ApiErrorResponse` OpenAPI schema/types and tests added; backend tests 7/7, typecheck/build/lint/diff-check passed; contract generated |
| TR-305 | Реализовать RBAC middleware/policies | Done | P0 | Backend/Security | Codex | 2026-06-04 | Done: scoped RBAC policy primitives and Fastify preHandler factory added; roles admin/owner/expert/employee/executive tested; backend tests 12/12, typecheck/build/lint/diff-check passed |
| TR-306 | Реализовать audit log для CRUD | Done | P0 | Backend/Data/Security | Codex | 2026-06-04 | Done: `AuditEvent` Prisma model, SQLite migration and transaction-scoped audit helper/tests added; verified actor/version/snapshot fields; backend tests 15/15, typecheck/build/lint/diff-check passed |
| TR-307 | Реализовать reason-required manual correction | Done | P0 | Backend/Data/Security | Codex | 2026-06-04 | Done: audit helper enforces non-empty reason for correction/admin_override/decision/delete/status_change; backend tests 17/17, typecheck/build/lint/diff-check passed |
| TR-309 | Подключить application Prisma client для SQLite | Done | P0 | Backend/Data | Codex | 2026-06-04 | Done: `@prisma/adapter-better-sqlite3` added, generated client moved under `src`, Prisma client factory added and smoke-tested against local SQLite |
| TR-002 | Управление справочниками департаментов, доменов и статусов | Done | P0 | Backend/Data/Security | Codex | 2026-06-04 | Done: admin reference-data API added for list/create/update/deactivate dictionaries with current actor RBAC, reason-required audit events, OpenAPI contract/types and tests; backend tests 26/26, typecheck/build/lint/db validate/generate/migrate-status/diff-check passed |
| TR-022 | Импортировать стартовый реестр из материалов | Blocked | P0 | Product/Data | TBD | 2026-06-04 | Blocked: нужны domain entity models and import publication flow before database import |
| TR-010 | Создать карточку тренда | Done | P0 | Backend/Data/API | Codex | 2026-06-04 | Done: `Trend` Prisma model/migration and `/api/v1/trends` list/get/create/update API added with dictionary refs, owner, review date, status, RBAC and reason-required audit; backend tests 28/28, typecheck/build/lint/db validate/generate/migrate-status/diff-check passed |
| TR-014 | Сделать домен обязательным полем тренда | Done | P0 | Backend/Data/API | Codex | 2026-06-04 | Done: `Trend.domain_id` is NOT NULL with FK, API create requires `domainCode`, OpenAPI marks it required and backend test rejects missing domain; publish endpoint not implemented yet; backend tests 29/29, typecheck/build/lint/migrate-status/diff-check passed |
| TR-016 | Поддержать IT trend MVP без внешнего сборщика | Done | P0 | Backend/Data/API | Codex | 2026-06-04 | Done: backend route test verifies manual create/edit of `technology` trend through `/api/v1/trends`; audit events are `source=manual`, no collector dependency; backend tests 29/29 and diff-check passed |
| TR-011 | Реализовать фильтры списка трендов | Done | P0 | Backend/API | Codex | 2026-06-04 | Done: `GET /api/v1/trends` supports `domainCode`, `statusCode`, `ownerId`, `departmentId` query filters; OpenAPI/types and route tests updated; backend tests 29/29, typecheck/build/lint/diff-check passed |
| TR-320 | Реализовать Trend list view | Done | P0 | Frontend/UI | Codex | 2026-06-04 | Done: React `/trends` list view added with URL-backed filters, loading/error/empty states, Vite API proxy and MOEX token CSS; browser screenshots checked light/dark/inverted; typecheck/build/lint/raw-color scan/diff-check passed |
| TR-321 | Реализовать Trend detail view | Done | P0 | Frontend/UI | Codex | 2026-06-04 | Done: React `/trends/:id` detail view added, list rows link to detail, source traceability and related innovations/pilots/metrics empty sections visible; browser screenshots checked light/dark/inverted; typecheck/build/lint/raw-color scan/diff-check passed |
| TR-310 | Подготовить seed data file для PDF-инициатив | Done | P0 | Product/Data | Codex | 2026-06-03 | Done: `data/seed/strategic-initiatives.seed.json`; 7 records validated against traceability contract |
| TR-311 | Подготовить seed data file для первичных трендов | Done | P0 | Product/Data | Codex | 2026-06-03 | Done: `data/seed/primary-technology-trends.seed.json`; 10 records validated, source number `9` absent |
| TR-313 | Реализовать source traceability fields | Done | P0 | Data/Backend | Codex | 2026-06-03 | Done: SourceTrace documented; `pnpm seed:check` validates PDF/raw/source numbers |
| TR-312 | Реализовать seed loader | Done | P0 | Backend/Data | Codex | 2026-06-04 | Done: `pnpm seed:load` added; generated 17-record traceable load artifact; repeated compiled loader run reports `changed: false`; full Vitest blocked by local Node 18, project requires Node >=24 |
| TR-073 | Страница "Мои тренды" | Backlog | P0 | Product/UX | TBD | 2026-06-03 | Требует UX-gate |
| TR-074 | Статус своей идеи | Backlog | P0 | Product/UX | TBD | 2026-06-03 | Требует workflow и feedback SLA |
| TR-075 | Полезный ответ при отклонении идеи | Backlog | P0 | Product/UX | TBD | 2026-06-03 | Требует UX copy и decision reasons |

## Правила обновления

- При начале работы менять `Status` на `In Progress`, заполнять `Assignee`, обновлять `Updated at`.
- Если задача требует анализа, переводить в `Discovery`.
- Если задача заблокирована, переводить в `Blocked` и писать blocker в `Notes`.
- После выполнения Definition of Done переводить в `Done` и кратко указать evidence.
- Не менять product backlog acceptance criteria в этой доске; для этого обновлять `docs/04-backlog.md`.
