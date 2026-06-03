# trends

Корпоративный портал трендов: документация, исходные материалы и backlog продукта.

## Структура

- `source-materials/` - исходные PDF с постановкой и реестром инициатив.
- `docs/source-materials.md` - индекс исходных материалов.
- `docs/01-materials-analysis.md` - анализ PDF и требований.
- `docs/02-market-analysis.md` - рыночный анализ и лучшие практики.
- `docs/03-product-concept.md` - концепция портала.
- `docs/04-backlog.md` - backlog по эпикам и MVP-срез.
- `docs/05-data-model.md` - черновая модель данных.
- `docs/06-trend-domains-and-refresh.md` - домены трендов, источники, формат внешних сигналов и регламент обновления.
- `docs/07-architecture.md` - архитектура открытого сборщика и закрытого портала.
- `docs/08-implementation-roadmap.md` - этапы внедрения: IT-тренды, биржевые/финансовые, регуляторика, HR, продукты, ESG, автоматизация.
- `docs/09-independent-value-analysis.md` - независимый анализ ценности: выручка, рейтинг, эффективность, вовлеченность и личная польза сотрудников.
- `docs/10-design-system-ui-rules.md` - будущие правила подключения MOEX design system skills и обязательные UI rules.
- `docs/11-technology-stack.md` - ограничения по стеку: React на frontend и TypeScript на backend.
- `docs/12-implementation-readiness-review.md` - проверка целостности документации и готовности к старту реализации.
- `docs/13-source-traceability.md` - матрица покрытия PDF-материалов, seed-набор инициатив и первичных трендов.
- `docs/14-backlog-operating-model.md` - правила формирования backlog, Definition of Ready/Done и цикл работы над задачей.
- `docs/15-required-expertise-and-skills.md` - необходимые роли/skills: trend analysis, UX, design system, data governance, QA и другие.
- `docs/16-team-workflow.md` - командный workflow статусов, WIP limits и правила "беру в работу / в работе / сделано".
- `docs/17-task-board.md` - временная task board в репозитории до подключения внешнего issue tracker.
- `docs/18-full-implementation-backlog.md` - полный implementation backlog по release slices и задачам реализации.
- `docs/19-backlog-coverage-review.md` - проверка, что требования из документации заведены в backlog.
- `docs/20-development-workspace.md` - структура pnpm workspace и базовые dev-команды.
- `docs/adr/` - архитектурные решения перед реализацией.
- `AGENTS.md` - рабочие правила для будущих implementation agents.
- `docs/research/raw-*.txt` - извлеченный текст PDF для воспроизводимости анализа.

## Текущий фокус

MVP должен поддержать KPI 1.3 на 2026 год: скоринг минимум 3 инноваций на платформу/департамент в квартал и пилотирование минимум одного актуального технологического тренда каждой платформой/департаментом.

Целевая картина шире технологических трендов: портал должен поддерживать биржевые и финансовые, продуктовые, регуляторные, HR, операционные, макроотраслевые и ESG-тренды. Внешний сбор информации проектируется отдельно от закрытого корпоративного портала: открытый сборщик формирует проверенные пакеты сигналов, закрытый контур импортирует их через валидацию и review доменных экспертов.

Внедрение идет поэтапно: сначала IT/технологические тренды и ручной ввод, затем биржевые и финансовые тренды, затем регуляторика/устойчивость/киберриски, HR, продуктовые, макроотраслевые и ESG-домены. Ручная корректировка данных должна оставаться доступной на всех этапах, даже после появления автоматического сборщика.

Отдельный критерий успеха: портал должен быть полезен не только руководству, но и каждому сотруднику. Для этого в целевую модель добавлены "Мои тренды", профиль вклада, обратная связь по идеям, связь трендов с навыками/обучением и value scorecard компании.

MOEX design system skills подключены как `.skills` submodule, а правила UI-разработки закреплены в корневом `AGENTS.md`. Активная UI-разработка должна использовать обязательные skills `foundations-tokens`, `foundations-themes` и `component-button`.

Ограничение по стеку для будущей реализации: frontend на React, backend на TypeScript. Для frontend MVP выбран Vite + React + TypeScript SPA, решение зафиксировано в `docs/adr/0001-frontend-build-tool.md`. Для backend MVP выбран Node.js 24 LTS + Fastify + TypeScript, решение зафиксировано в `docs/adr/0002-backend-runtime-framework.md`. API baseline: REST JSON `/api/v1` + OpenAPI 3.0.3 + generated TypeScript types, ADR `docs/adr/0003-api-style-shared-types.md`. Storage baseline: PostgreSQL + Prisma ORM/Migrate + traceable idempotent seed strategy, ADR `docs/adr/0004-storage-migrations-seed.md`. RBAC baseline: scoped roles `employee`, `trend_owner`, `expert`, `executive`, `admin`, ADR `docs/adr/0005-rbac-mvp.md`. Audit baseline: append-only `AuditEvent` + per-entity versioning, ADR `docs/adr/0006-audit-log-versioning.md`.
