# Архитектура открытого сборщика и закрытого портала

## Контуры

Система делится на два изолированных контура:

1. Открытый контур: сбор публичной информации из интернета и платных/разрешенных источников.
2. Закрытый контур: корпоративный портал, внутренние тренды, инициативы, скоринг, пилоты, KPI и решения.

Цель разделения - не дать закрытому порталу прямой интернет-доступ и не раскрывать наружу внутренний портфель инноваций.

## Ограничения по стеку

- Frontend закрытого портала должен быть реализован на React.
- Backend закрытого портала должен быть реализован на TypeScript.
- Основное хранилище MVP: SQLite через Prisma ORM/Migrate.
- PostgreSQL не используется в MVP; его можно рассматривать только как будущую миграцию через отдельный ADR.
- Конкретные frontend/backend framework и runtime должны быть выбраны отдельным архитектурным решением до начала реализации.
- UI должен использовать MOEX design system rules из `docs/10-design-system-ui-rules.md`.
- Подробно: `docs/11-technology-stack.md`.

## Компоненты открытого контура

| Компонент | Назначение |
| --- | --- |
| Source Registry | Allowlist источников, правила частоты, владельцы доменов, trust level |
| Collectors | Коннекторы к RSS/API/страницам/отчетам/ручной загрузке |
| Normalizer | Приведение к единой схеме `ExternalSignal` |
| Deduplicator | Объединение повторяющихся сигналов |
| Classifier | Домен, теги, язык, тип источника, предполагаемый тренд |
| Summarizer | Короткое summary без переноса длинного copyrighted текста |
| Package Builder | Формирование подписанного batch-пакета JSON/CSV/Markdown |
| Quarantine Scanner | Проверка на активный контент, malware, schema violations |

## Компоненты закрытого контура

| Компонент | Назначение |
| --- | --- |
| Import Gateway | Прием только подписанных пакетов разрешенного формата |
| Validation Service | Проверка hash, подписи, схемы, источников, классификации |
| Staging Area | Зона предварительного просмотра внешних сигналов |
| Review Workflow | Подтверждение доменным экспертом |
| Manual Editing UI | Ручной ввод и корректировка трендов, сигналов, инициатив, скорингов, пилотов и решений |
| Trend Repository | Основная база трендов и сигналов на SQLite/Prisma в MVP |
| Innovation Portal | Реестр инноваций, скоринг, пилоты, KPI |
| Audit Log | История импортов, решений, изменений и публикаций |

## API error conventions

Backend API returns errors in one JSON shape:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Request validation failed",
    "statusCode": 400,
    "requestId": "req-1",
    "details": {}
  }
}
```

Base error codes:

- `validation_error`
- `unauthorized`
- `forbidden`
- `not_found`
- `conflict`
- `internal_error`

Validation errors include structured `details`; internal errors do not expose implementation details. OpenAPI keeps the shared `ApiErrorResponse` schema and reusable responses for future CRUD/RBAC endpoints.

## Reference data API baseline

Backend exposes dictionary management under `/api/v1/reference-data/:dictionary`.

- `GET /reference-data/:dictionary` lists dictionary items.
- `POST /reference-data/:dictionary` creates dictionary items.
- `PATCH /reference-data/:dictionary/:id` updates dictionary items and requires `reason`.
- `POST /reference-data/:dictionary/:id/deactivate` deactivates dictionary items and requires `reason`.

Supported MVP dictionaries are departments, trend domains, trend statuses, innovation statuses, pilot statuses, maturity rings and trend recommendations. Mutations require the MVP current actor header and `manage_reference_data` permission; each mutation writes an audit event in the same transaction.

## Trend API baseline

Backend exposes trend card management under `/api/v1/trends`.

- `GET /trends` lists trend cards and supports `domainCode`, `statusCode`, `ownerId` and `departmentId` query filters.
- `GET /trends/:id` returns one trend card.
- `POST /trends` creates a trend card and requires `create_edit_trend`.
- `PATCH /trends/:id` updates a trend card, requires `create_edit_trend` and requires `reason`.

The MVP trend card stores title, description, primary domain, optional secondary domain codes, maturity ring, recommendation, owner, review date, status, horizon, optional relevance score and optional source trace JSON. Mutations write audit events in the same transaction. UI list/detail experiences remain separate frontend backlog items.

## RBAC policy baseline

Backend authorization uses scope-aware RBAC policy primitives from ADR 0005. The baseline roles are:

- `employee`
- `trend_owner`
- `expert`
- `executive`
- `admin`

Role assignments can be global or scoped by domain, department or entity. Policy checks distinguish employee self-service, owner/editor capabilities, expert scoring/review, executive decisions and admin reference/user management. Fastify routes can use the RBAC preHandler factory once CRUD endpoints are introduced. Corporate identity integration remains out of MVP baseline until a separate decision.

For MVP protected API routes, backend resolves the current actor from local SQLite users by `X-Trends-Actor-Email`. The seeded local development admin is `admin@trends.local` with global `admin` role. This is a closed-contour MVP shim, not production SSO.

## Audit baseline

Audit infrastructure uses append-only `AuditEvent` records from ADR 0006. Each event stores entity type/id, before/after versions, actor id/type/role/scope, source, optional reason, focused before/after snapshots, changed fields, correlation id and timestamp. In SQLite, structured snapshots are stored as JSON text columns. Future CRUD services must write the business mutation and the audit event in one transaction.

Reason is mandatory for correction, admin override, decision, delete and status change audit event types. The backend audit helper rejects these events without a non-empty reason before writing the event.

## Поток данных

```text
Internet / paid sources
  -> Open Collectors
  -> Normalize + Deduplicate + Classify + Summarize
  -> Quarantine + Schema Validation + Signing
  -> Transfer Gateway
  -> Closed Import Gateway
  -> Signature/Hash/Schema Validation
  -> Staging
  -> Human Review
  -> Manual Correction / Override
  -> Trend Repository
  -> Innovation / Scoring / Pilot / KPI workflows
```

На этапе MVP этот поток начинается не с open collector, а с ручного ввода и импорта PDF/таблиц в закрытом контуре:

```text
Expert / owner input
  -> Manual Editing UI
  -> Validation
  -> Audit Log
  -> Trend Repository
  -> Innovation / Scoring / Pilot / KPI workflows
```

## Правила передачи между контурами

- Передача преимущественно однонаправленная: из открытого контура в закрытый.
- Запрещено передавать исполняемые файлы, макросы, архивы с неизвестным содержимым, активный HTML.
- Разрешенные форматы: JSON по схеме, CSV, Markdown без HTML, PDF только при ручном исключении.
- Каждый пакет подписывается и содержит hash по каждому item.
- Все URL сохраняются как текстовые ссылки, а не как встраиваемый активный контент.
- В закрытом контуре повторяется валидация, даже если открытый контур уже проверил пакет.
- Обратная связь из закрытого контура наружу допускается только в агрегированном виде без внутренних названий проектов, владельцев, оценок и стратегии.
- Ручная корректировка в закрытом контуре имеет приоритет над автоматическим импортом до явного подтверждения владельца данных.

## Модель безопасности

Основные угрозы:

- supply chain атака через источник или parser;
- перенос вредоносного содержимого в закрытый контур;
- утечка внутреннего портфеля через feedback loop;
- подмена пакета при передаче;
- загрязнение базы низкокачественными или манипулятивными сигналами.

Контрмеры:

- allowlist источников;
- изоляция open collector;
- запуск парсеров в sandbox;
- schema-first import;
- detached signatures;
- hash и immutable audit log;
- ручное подтверждение публикации тренда;
- trust scoring источников;
- rate limits и anomaly detection на объемы сигналов.

## Развертывание по этапам

### MVP

- Основной способ наполнения - ручной ввод IT-трендов и импорт стартовых PDF/таблиц.
- Ручная корректировка всех сущностей с audit log.
- Source registry в виде справочника.
- Staging и ручной review для вручную добавленных или импортированных стартовых данных.
- Связь сигналов с трендами.
- JSON/CSV импорт внешних сигналов остается P1-задачей после стабилизации MVP.

### 2027

- Автоматические open collectors для приоритетных источников.
- Дедупликация и классификация.
- Подпись batch-пакетов.
- Ежемесячный radar refresh.

### 2028+

- AI-assisted horizon scanning.
- Прогнозные инновации.
- Обучение relevance model на решениях экспертов.
- Расширенные сценарии и impact simulation.
