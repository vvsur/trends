# Implementation Readiness Review

## Итоговая оценка

Документация достаточно целостная, чтобы переходить к подготовке реализации MVP. Основная рамка согласована:

- MVP фокусируется на IT/технологических трендах и KPI 1.3;
- ручной ввод и ручная корректировка являются обязательными с первого этапа;
- нетехнологические домены предусмотрены в модели и roadmap, но подключаются поэтапно;
- ценность для компании выражена через revenue, efficiency, risk, market position и employer/innovation reputation;
- ценность для сотрудников выражена через "Мои тренды", статус идей, feedback SLA, профиль вклада, навыки, обучение и открытые пилоты;
- UI должен идти через MOEX design system skills;
- frontend ограничен React, backend ограничен TypeScript.

## Ценность для компании

Документация явно показывает, зачем компании нужен портал:

| Направление ценности | Где отражено | Достаточность |
| --- | --- | --- |
| Выручка и новые продукты | `docs/09-independent-value-analysis.md`, `docs/03-product-concept.md`, TR-054/TR-055 | Достаточно для MVP; фактические формулы можно уточнять при реализации |
| Снижение затрат и эффективность | `docs/09-independent-value-analysis.md`, ValueMetric | Достаточно; нужны baseline/target в пилотах |
| Риск и устойчивость | `docs/01-materials-analysis.md`, `docs/07-architecture.md`, `docs/09-independent-value-analysis.md` | Достаточно для первого контура |
| Рыночная позиция и рейтинг | `docs/09-independent-value-analysis.md`, TR-056 | Достаточно как целевой контур, метрики нужно уточнить с PR/HR/strategy |
| Управляемость KPI 1.3 | `docs/01-materials-analysis.md`, `docs/04-backlog.md` | Достаточно для MVP |

## Ценность для сотрудников

Документация делает правильный акцент: портал должен быть полезен каждому сотруднику, а не только руководству.

| Интерес сотрудника | Где отражено | Достаточность |
| --- | --- | --- |
| Понимать влияние трендов на свою роль | "Мои тренды", EmployeeProfile, TR-073 | Достаточно для MVP |
| Видеть судьбу своей идеи | TR-074, TR-075, feedback SLA | Достаточно для MVP |
| Получать признание за вклад | Contribution, профиль вклада, TR-076 | Достаточно; можно расширить после MVP |
| Развивать навыки | Skill map, TR-077, roadmap HR-этапа | Достаточно для стартовой реализации |
| Попадать в интересные пилоты | `docs/09-independent-value-analysis.md`, TR-073 | Достаточно; нужна UI-проработка |
| Экономить время на поиске | UX-принципы, персонализация | Достаточно как продуктовый принцип |

## Согласованность MVP

MVP должен включать:

- IT/technology domain;
- карточку тренда;
- реестр инноваций;
- скоринг;
- pilot workflow;
- KPI/value dashboards;
- ручной ввод и ручную корректировку;
- audit log;
- "Мои тренды";
- статус и feedback по идеям;
- базовый профиль вклада;
- React frontend;
- TypeScript backend;
- MOEX design system rules до активной UI-разработки.
- seed-импорт 7 стратегических инициатив и 10 первичных трендов/инноваций из PDF, описанных в `docs/13-source-traceability.md`.
- backlog operating model, Definition of Ready/Done и обязательный цикл analysis -> implementation -> review/testing после каждой задачи.
- required expertise/skills: trend analysis, UX expertise, design system, data governance, QA, security/architecture, product ownership.

Внешний open collector, автоматический сбор сигналов, полноценные биржевые/HR/ESG домены и AI-assisted analytics остаются следующими этапами.

## Что нужно решить перед кодом

Перед созданием приложения нужно принять несколько архитектурных решений:

1. API style: REST, GraphQL или mixed.
2. Схема shared types между frontend и backend.
3. Хранилище данных и миграции.
4. Модель пользователей, ролей и интеграция с корпоративной оргструктурой.
5. Формат audit log и versioning.
6. Минимальный набор моковых данных для MVP.
7. Definition of Done для браузерной проверки UI.
8. Где и когда будет опубликован финальный регламент скоринга и ограничения.
9. Кто выполняет Product Owner, UX, Trend Analyst, QA и Security/Architecture роли на первом этапе.

Решено:

- TR-100: MOEX `.skills` submodule подключен, правила закреплены в `AGENTS.md`.
- TR-120: frontend build tool/framework выбран - Vite + React + TypeScript SPA, ADR `docs/adr/0001-frontend-build-tool.md`.
- TR-121: backend runtime/framework выбран - Node.js 24 LTS + Fastify + TypeScript, ADR `docs/adr/0002-backend-runtime-framework.md`.

## Риски перед стартом

| Риск | Последствие | Что сделать до/в начале реализации |
| --- | --- | --- |
| Начать UI без MOEX design system | Быстрая техническая и визуальная задолженность | TR-100 выполнен; для UI соблюдать `.skills` и `AGENTS.md` |
| Перегрузить MVP внешним сборщиком | Задержка запуска первого полезного контура | Оставить open collector на следующий этап |
| Не сделать "Мои тренды" | Сотрудники не увидят личной пользы | Включить TR-073 в первый UI-срез |
| Не сделать feedback SLA | Идеи будут восприниматься как черная дыра | Включить TR-074/TR-075 в первый workflow |
| Не связать пилоты с value metrics | Руководство не увидит бизнес-эффект | Включить TR-054 и базовый ValueMetric |
| Не определить роли | Ручная корректировка и review станут хаотичными | Зафиксировать RBAC до реализации |
| Потерять стартовый реестр из PDF | MVP начнется с пустого или неполного контекста | Использовать `docs/13-source-traceability.md` как seed contract |
| Придумать финальный скоринг до публикации регламента | Модель придется болезненно переделывать | Реализовать configurable draft scoring и TR-036 |

## Рекомендованный первый implementation slice

Первый технический срез должен быть узким, но полезным:

1. Выбрать API/shared types, storage/migrations, RBAC и audit log.
2. Создать React/TypeScript application skeleton и TypeScript backend skeleton.
3. Сделать модель ролей и audit log.
4. Реализовать справочники: domain, department, status, trend maturity.
5. Реализовать ручной CRUD для IT-трендов.
6. Загрузить seed-набор из PDF: стратегические инициативы и первичные тренды/инновации.
7. Реализовать реестр инноваций и связь с трендом.
8. Реализовать базовый configurable draft scoring.
9. Реализовать "Мои тренды" и статус моей идеи.
10. Реализовать MVP dashboard: KPI 1.3 + value scorecard skeleton.

После этого можно расширять pilot workflow и бизнес-кейсы.
