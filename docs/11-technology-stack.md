# Technology Stack Constraints

## Статус

Этот документ фиксирует ограничения по стеку для будущей реализации. Код сейчас не создается и зависимости не устанавливаются.

## Обязательные ограничения

- Frontend: React.
- Backend: TypeScript.
- UI: MOEX design system skills после подключения `.skills`.

## Frontend

Frontend должен разрабатываться на React.

Обязательные правила:

- использовать React для построения пользовательского интерфейса;
- не выбирать альтернативные UI-фреймворки как основу приложения без отдельного архитектурного решения;
- до активной UI-разработки подключить MOEX design system skills и закрепить правила в `AGENTS.md`;
- все UI-компоненты строить с учетом `docs/10-design-system-ui-rules.md`.

Архитектурное решение TR-120:

- frontend build tool/framework для MVP: Vite + React + TypeScript SPA;
- ADR: `docs/adr/0001-frontend-build-tool.md`;
- routing будет добавлен как frontend-level React Router library в skeleton-срезе, без принятия full-stack React framework mode в MVP.

## Backend

Backend должен разрабатываться на TypeScript.

Обязательные правила:

- backend-код, доменная логика, API и интеграционные сервисы должны быть типизированы на TypeScript;
- не использовать JavaScript без TypeScript для production backend-кода;
- конкретный backend framework выбирается отдельным архитектурным решением;
- open collector может быть отдельным сервисом, но если он входит в продуктовый backend-контур, он также должен соответствовать TypeScript-ограничению.

Архитектурное решение TR-121:

- backend runtime/framework для MVP: Node.js 24 LTS + Fastify + TypeScript;
- ADR: `docs/adr/0002-backend-runtime-framework.md`;
- production backend должен собираться через TypeScript compiler и запускаться как compiled JavaScript на Node.js;
- request/response validation должна использовать доверенные статические схемы приложения, а не пользовательские dynamic schemas.

## Требует отдельного решения

Архитектурное решение TR-122:

- API style для MVP: REST JSON API;
- API versioning: `/api/v1`;
- contract: OpenAPI 3.0.3 generated from trusted Fastify route schemas;
- backend schema authoring: TypeBox where practical;
- frontend shared types: generated with `openapi-typescript`;
- ADR: `docs/adr/0003-api-style-shared-types.md`.

## Еще требует отдельного решения

Архитектурное решение TR-123:

- primary database для MVP: PostgreSQL;
- data access/migrations: Prisma ORM + Prisma Migrate;
- target PostgreSQL: supported major, initially PostgreSQL 17+;
- seed strategy: versioned source files + idempotent TypeScript seed runner, preserving `docs/13-source-traceability.md`;
- rollback strategy: backups + forward-fix migrations, destructive changes only with explicit plan;
- ADR: `docs/adr/0004-storage-migrations-seed.md`.

## Все еще требует отдельного решения

Перед началом реализации нужно выбрать и зафиксировать:

- стратегия тестирования frontend/backend;
- способ интеграции с закрытым контуром, import gateway и audit log.
