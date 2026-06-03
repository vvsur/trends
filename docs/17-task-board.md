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
| TR-123 | Выбрать хранилище данных и стратегию миграций | Done | P0 | Architecture/Data | Codex | 2026-06-03 | Done: ADR `docs/adr/0004-storage-migrations-seed.md`, выбран PostgreSQL + Prisma ORM/Migrate |
| TR-124 | Определить RBAC и роли MVP | Done | P0 | Product/Security | Codex | 2026-06-03 | Done: ADR `docs/adr/0005-rbac-mvp.md`, scoped roles employee/trend_owner/expert/executive/admin |
| TR-125 | Определить формат audit log и versioning | Done | P0 | Architecture/Security | Codex | 2026-06-03 | Done: ADR `docs/adr/0006-audit-log-versioning.md`, AuditEvent + per-entity versioning |
| TR-202 | Настроить monorepo/workspace или структуру FE/BE | Done | P0 | Architecture | Codex | 2026-06-03 | Done: pnpm workspace, apps/frontend, apps/backend, packages/api-contract, dev commands documented |
| TR-200 | Создать frontend skeleton на React | Done | P0 | Architecture/Frontend | Codex | 2026-06-03 | Done: Vite React skeleton, routes-заглушки, MOEX token CSS, typecheck/build/browser check |
| TR-201 | Создать backend skeleton на TypeScript | Done | P0 | Architecture/Backend | Codex | 2026-06-03 | Done: Fastify TypeScript skeleton, `/api/v1/health`, app factory test |
| TR-203 | Настроить lint/typecheck/test baseline | Done | P0 | Architecture/QA | Codex | 2026-06-03 | Done: ESLint baseline; root lint/typecheck/test/build pass |
| TR-204 | Настроить shared types/API contract baseline | Done | P0 | Architecture/API | Codex | 2026-06-03 | Done: OpenAPI 3.0.3 baseline, generated TS types, FE/BE type-only usage, stale check |
| TR-205 | Настроить базовый layout приложения | Done | P0 | Frontend | Codex | 2026-06-03 | Done: layout/navigation components extracted, MOEX token states aligned, desktop/mobile browser check |
| TR-206 | Настроить light/dark/inverted theme shell | Done | P0 | Frontend | Codex | 2026-06-03 | Done: centralized theme shell, localStorage persistence, color-scheme sync, 4-state browser check |
| TR-207 | Настроить начальный test evidence format | Ready | P0 | QA | TBD | 2026-06-03 | Следующая foundation задача; зависит от TR-203 |
| TR-022 | Импортировать стартовый реестр из материалов | Ready | P0 | Product/Data | TBD | 2026-06-03 | Использовать seed contract из `docs/13-source-traceability.md` |
| TR-073 | Страница "Мои тренды" | Backlog | P0 | Product/UX | TBD | 2026-06-03 | Требует UX-gate |
| TR-074 | Статус своей идеи | Backlog | P0 | Product/UX | TBD | 2026-06-03 | Требует workflow и feedback SLA |
| TR-075 | Полезный ответ при отклонении идеи | Backlog | P0 | Product/UX | TBD | 2026-06-03 | Требует UX copy и decision reasons |

## Правила обновления

- При начале работы менять `Status` на `In Progress`, заполнять `Assignee`, обновлять `Updated at`.
- Если задача требует анализа, переводить в `Discovery`.
- Если задача заблокирована, переводить в `Blocked` и писать blocker в `Notes`.
- После выполнения Definition of Done переводить в `Done` и кратко указать evidence.
- Не менять product backlog acceptance criteria в этой доске; для этого обновлять `docs/04-backlog.md`.
