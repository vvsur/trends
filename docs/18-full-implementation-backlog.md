# Full Implementation Backlog

## Назначение

Этот документ раскладывает стратегический backlog из `docs/04-backlog.md` в реализационные задачи. Он нужен для старта разработки и командной работы.

Правила:

- `docs/04-backlog.md` остается product backlog верхнего уровня.
- Этот документ содержит implementation backlog: конкретные задачи, зависимости, статус готовности и проверяемые результаты.
- Статусы должны синхронизироваться с `docs/17-task-board.md` для задач текущей итерации.
- Каждая задача проходит цикл из `docs/14-backlog-operating-model.md`: analysis -> implementation -> self-review -> testing -> result analysis.
- Задачи с UI должны соблюдать `docs/10-design-system-ui-rules.md`.
- Задачи с seed/PDF-данными должны соблюдать `docs/13-source-traceability.md`.

## Легенда статусов

- `Backlog`: задача зафиксирована, но требует refinement.
- `Discovery`: нужен анализ/решение перед delivery.
- `Ready`: можно брать в работу после проверки Definition of Ready.
- `Blocked`: нельзя делать без внешнего решения.
- `Done`: выполнено и отражено в документации/коде.

## Release 0. Governance, Design System, Architecture Decisions

Цель: подготовить проект к безопасной реализации.

| ID | Priority | Status | Task | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| TR-102 | P0 | Done | Зафиксировать и соблюдать ограничения стека: React frontend, TypeScript backend | `docs/11-technology-stack.md` | Frontend ограничен React; backend ограничен TypeScript; дальнейшие framework/runtime выбираются через ADR |
| TR-110 | P0 | Done | Закрепить правила формирования backlog и работы с задачами | `docs/14-backlog-operating-model.md` | Backlog operating model описывает DoR, DoD, analysis before implementation, testing и result analysis |
| TR-111 | P0 | Done | Закрепить обязательные skills/expertise для реализации портала | `docs/15-required-expertise-and-skills.md` | Skill matrix покрывает Trend Analysis, UX, MOEX DS, Data Governance, QA, Security/Architecture, Product |
| TR-112 | P0 | Done | Добавить рабочие правила для implementation agents | `AGENTS.md` | Agents обязаны читать docs, вести board, соблюдать React/TypeScript и MOEX DS guardrails |
| TR-113 | P0 | Done | Закрепить командный workflow статусов backlog | `docs/16-team-workflow.md` | Описаны статусы, переходы, роли, WIP limits и blocked rules |
| TR-114 | P0 | Done | Вести task board для командной работы до подключения issue tracker | `docs/17-task-board.md` | Board содержит status, owner, assignee, updated_at, notes |
| TR-115 | P0 | Done | Сформировать полный implementation backlog по всей документации | This document | Backlog покрывает product tasks, release slices, dependencies, acceptance criteria и next tasks |
| TR-116 | P0 | Done | Проверить покрытие всей документации задачами backlog | `docs/19-backlog-coverage-review.md` | Матрица покрытия создана; выявленные пробелы заведены в product и implementation backlog |
| TR-100 | P0 | Done | Подключить MOEX design system skills и закрепить правила UI-разработки | Доступ к `git@github.com:ui-sigma/sigma-skills.git` | `.skills` подключен как submodule; `AGENTS.md` обновлен registry и правилами; UI rules обязательны |
| TR-120 | P0 | Done | Выбрать frontend build tool/framework поверх React | TR-102 | ADR фиксирует выбор Vite + React + TypeScript SPA, причины, альтернативы, последствия |
| TR-121 | P0 | Done | Выбрать TypeScript backend runtime/framework | TR-102 | ADR фиксирует выбор Node.js 24 LTS + Fastify + TypeScript, причины, альтернативы, последствия |
| TR-122 | P0 | Done | Выбрать API style и контракт shared types | TR-120, TR-121 | Зафиксировано REST JSON API + OpenAPI 3.0.3 + generated TypeScript types |
| TR-123 | P0 | Done | Выбрать хранилище данных и стратегию миграций | TR-121 | ADR фиксирует PostgreSQL + Prisma ORM/Migrate, traceable seed strategy and rollback policy |
| TR-124 | P0 | Done | Определить RBAC и роли MVP | `docs/03-product-concept.md` | Описаны роли employee, trend_owner, expert, executive, admin; права на CRUD/review/correction и scope-aware assignments |
| TR-125 | P0 | Done | Определить формат audit log и versioning | TR-005, TR-006 | Зафиксированы AuditEvent fields, tracked entities, before/after, actor, reason and entity versioning |
| TR-126 | P0 | Backlog | Определить Definition of Done для browser/UI проверки | TR-100 | Зафиксированы браузер, разрешение, темы, screenshots/evidence |
| TR-127 | P0 | Backlog | Назначить обязательные expertise/roles на первый этап | TR-111 | Назначены Product, UX, Trend Analyst, QA, Security/Architecture owners |

## Release 1. Application Skeleton and Platform Foundation

Цель: создать технический каркас frontend/backend без бизнес-сложности.

| ID | Priority | Status | Task | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| TR-001 | P0 | Blocked | Главная страница портала с ключевыми разделами | TR-100, TR-200, TR-205 | Есть навигация: техрадар, реестр, скоринг, пилоты, KPI, кейсы |
| TR-200 | P0 | Done | Создать frontend skeleton на React | TR-100, TR-120, TR-202 | Vite React skeleton запускается; маршруты-заглушки есть; MOEX token CSS подключен; typecheck/build/browser check пройдены |
| TR-201 | P0 | Ready | Создать backend skeleton на TypeScript | TR-121, TR-202 | Backend запускается локально; health endpoint; базовая структура модулей |
| TR-202 | P0 | Done | Настроить monorepo/workspace или структуру FE/BE | TR-120, TR-121 | pnpm workspace структура понятна; команды install/dev/test documented |
| TR-203 | P0 | Blocked | Настроить lint/typecheck/test baseline | TR-200, TR-201 | Есть команды lint/typecheck/test; они проходят на skeleton |
| TR-204 | P0 | Blocked | Настроить shared types/API contract baseline | TR-122 | FE и BE используют общий контракт или generated client/types |
| TR-205 | P0 | Blocked | Настроить базовый layout приложения | TR-100, TR-200 | Навигация по основным разделам без ad hoc UI |
| TR-206 | P0 | Blocked | Настроить light/dark/inverted theme shell | TR-100, TR-200 | Переключение/проверка тем работает на shell |
| TR-207 | P0 | Blocked | Настроить начальный test evidence format | TR-203 | Документирован формат вывода тестов/screenshots/manual checks |

## Release 2. Core Domain Model, Reference Data, Audit

Цель: создать фундамент данных, ручной корректировки и auditability.

| ID | Priority | Status | Task | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| TR-002 | P0 | Blocked | Управление справочниками департаментов, доменов и статусов | TR-300, TR-301, TR-302, TR-305 | Admin может создать/изменить/деактивировать справочник без изменения кода |
| TR-004 | P0 | Blocked | Поэтапное включение доменов | TR-300 | В MVP активен `technology`; остальные домены включаются позднее без миграции данных |
| TR-005 | P0 | Blocked | Ручная корректировка данных пользователем с правами | TR-305, TR-306, TR-307 | Для трендов, инноваций, скорингов, пилотов, источников и решений есть редактирование с причиной |
| TR-006 | P0 | Blocked | История изменений процесса | TR-306 | Audit log показывает автора, дату, старое значение, новое значение, причину и источник |
| TR-300 | P0 | Blocked | Реализовать справочник доменов трендов | TR-123, TR-201 | Есть `technology`; остальные домены предусмотрены, но disabled/hidden для MVP |
| TR-301 | P0 | Blocked | Реализовать справочник департаментов | TR-123 | Есть ITG, КСС, TKC; можно добавить/изменить/деактивировать |
| TR-302 | P0 | Blocked | Реализовать справочники статусов pipeline | TR-123 | Статусы innovation/pilot/trend соответствуют backlog |
| TR-303 | P0 | Blocked | Реализовать справочник maturity/recommendation | TR-123 | Есть watch/assess/pilot/scale/hold или локализованные аналоги |
| TR-304 | P0 | Blocked | Реализовать User/EmployeeProfile модель | TR-124 | Есть роль, департамент, навыки, интересы, подписки |
| TR-305 | P0 | Blocked | Реализовать RBAC middleware/policies | TR-124, TR-201 | Права различают admin, owner, expert, employee, executive |
| TR-306 | P0 | Blocked | Реализовать audit log для CRUD | TR-125 | Create/update/delete фиксируют actor, before/after, reason, timestamp |
| TR-307 | P0 | Blocked | Реализовать reason-required manual correction | TR-306 | Ручная корректировка требует reason и видна в истории |
| TR-308 | P0 | Blocked | Реализовать базовые API error conventions | TR-201 | Ошибки валидации/доступа/не найдено имеют единый формат |

## Release 3. Seed Import from PDF and Source Traceability

Цель: не потерять исходный контекст и стартовать MVP не с пустой базы.

| ID | Priority | Status | Task | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| TR-022 | P0 | Ready | Импортировать стартовый реестр из материалов | TR-300, TR-301 | Импортированы 7 стратегических инициатив и 10 трендов из `docs/13-source-traceability.md` |
| TR-310 | P0 | Blocked | Подготовить seed data file для PDF-инициатив | TR-123 | Seed содержит source_pdf, source_number, department, created_quarter, owner, year, comment |
| TR-311 | P0 | Blocked | Подготовить seed data file для первичных трендов | TR-123 | Seed сохраняет пропуск номера `9`; владельцы/комментарии сохранены |
| TR-312 | P0 | Blocked | Реализовать seed loader | TR-310, TR-311 | Повторный запуск идемпотентен; ошибки показывают строку/поле |
| TR-313 | P0 | Blocked | Реализовать source traceability fields | TR-123 | У seed-записей есть ссылка на PDF/raw/source number |
| TR-314 | P0 | Blocked | Реализовать UI/API для проверки seed после импорта | TR-312, TR-205 | Пользователь видит, что импортировано и что требует ручной проверки |
| TR-315 | P0 | Blocked | Реализовать ручную корректировку seed-записей | TR-307, TR-314 | Любое исправление seed сохраняет audit trail и source traceability |

## Release 4. Trend Radar and Trend CRUD

Цель: дать владельцу тренда рабочую карточку и список IT-трендов.

| ID | Priority | Status | Task | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| TR-010 | P0 | Blocked | Создать карточку тренда | TR-300, TR-305 | Поля: title, description, domain, maturity, recommendation, owner, review date, status |
| TR-011 | P0 | Blocked | Реализовать фильтры списка трендов | TR-010 | Фильтры по domain, status, owner, department сохраняются в URL |
| TR-012 | P1 | Blocked | Радарная визуализация трендов | TR-323 | Тренды распределены по кольцам зрелости и квадрантам доменов |
| TR-013 | P1 | Blocked | Фиксация источников сигналов у тренда | TR-324 | У тренда есть список источников, дата сигнала и краткая интерпретация |
| TR-014 | P0 | Blocked | Сделать домен обязательным полем тренда | TR-300, TR-010 | Без domain нельзя создать/опубликовать trend |
| TR-015 | P1 | Blocked | Cross-domain тренды | TR-004, TR-014 | Один тренд может быть связан с несколькими доменами и показывает влияние на бизнес, технологии, риск и HR |
| TR-016 | P0 | Blocked | Поддержать IT trend MVP без внешнего сборщика | TR-010 | Тренд `technology` создается/редактируется вручную |
| TR-017 | P1 | Blocked | Подключение биржевых и финансовых трендов вторым этапом | TR-500 | Домен `exchange_finance` имеет владельца, источники, review workflow и отдельные фильтры |
| TR-320 | P0 | Blocked | Реализовать Trend list view | TR-010, TR-011 | Есть список, пустое состояние, loading, error, permission states |
| TR-321 | P0 | Blocked | Реализовать Trend detail view | TR-010 | Видны связанные innovations, pilots, metrics, source traceability |
| TR-322 | P0 | Blocked | Реализовать Trend edit workflow | TR-307, TR-321 | Редактирование требует прав и reason для опубликованных данных |
| TR-323 | P1 | Blocked | Реализовать radar visualization | TR-012, TR-100 | Тренды распределены по maturity/rings и domain quadrants |
| TR-324 | P1 | Blocked | Реализовать source signals section | TR-013 | Можно добавить/посмотреть source signal вручную |

## Release 5. Innovation Registry and Idea Workflow

Цель: связать идеи/инновации с трендами и дать прозрачный pipeline.

| ID | Priority | Status | Task | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| TR-020 | P0 | Blocked | Создать инновацию в реестре | TR-010, TR-301 | Обязательные поля: title, department, owner, linked trend, description, expected effect |
| TR-021 | P0 | Blocked | Реализовать pipeline инноваций | TR-020, TR-302 | Статусы: предложено, на оценке, прошел скоринг, пилот, эффект измеряется, внедрено, остановлено, отложено |
| TR-023 | P1 | Blocked | Причины остановки/нереализуемости инноваций | TR-333 | Причины классифицированы: ИБ, архитектура, инфраструктура, ресурсы, эффект, дублирование |
| TR-024 | P0 | Blocked | Реализовать ручное исправление импортированной инновации | TR-315, TR-020 | Поля/связи/status редактируются с audit log |
| TR-025 | P0 | Blocked | Формулировать гипотезу из инновации | TR-336 | У гипотезы есть trend/innovation, expected effect, test criterion, owner, status, pilot link |
| TR-026 | P0 | Blocked | Фиксировать ранние ограничения инициативы | TR-337 | Ограничения ИБ, архитектуры, инфраструктуры, данных, ресурсов и compliance видны до пилота |
| TR-330 | P0 | Blocked | Реализовать форму предложения идеи сотрудником | TR-020, TR-305 | Employee может создать идею; получает статус и next step |
| TR-331 | P0 | Blocked | Реализовать карточку идеи/инновации | TR-020 | Видны trend, owner, status, comments, history, next action |
| TR-332 | P0 | Blocked | Реализовать комментарии эксперта к идее | TR-331 | Комментарии сохраняют автора, дату, visibility |
| TR-333 | P0 | Blocked | Реализовать причины отклонения/остановки | TR-023, TR-075 | Причины классифицированы: ИБ, архитектура, инфраструктура, ресурсы, эффект, дублирование |
| TR-334 | P0 | Blocked | Реализовать feedback SLA поля | TR-074, TR-331 | Есть due date, status overdue, owner responsible |
| TR-335 | P1 | Blocked | Реализовать duplicate detection manual marker | TR-333 | Эксперт может связать дубли и объяснить решение |
| TR-336 | P0 | Blocked | Реализовать Hypothesis model/API/UI MVP | TR-025, TR-020, TR-123, TR-305 | Гипотезу можно создать из инновации, связать с пилотом и отредактировать с audit log |
| TR-337 | P0 | Blocked | Реализовать Risk/Constraint section | TR-026, TR-305 | В карточках innovation/hypothesis/pilot есть constraints с owner, severity, status, comment |

## Release 6. Configurable Draft Scoring

Цель: запустить быстрый скоринг, не притворяясь, что финальный регламент уже опубликован.

| ID | Priority | Status | Task | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| TR-030 | P0 | Blocked | Провести быстрый скоринг инновации | TR-020, TR-305 | Impact, Confidence, Ease, Security fit, Architecture fit, Data availability |
| TR-031 | P0 | Blocked | Показать рейтинг инноваций после скоринга | TR-030 | Сортировка по score; видны компоненты и рекомендация |
| TR-032 | P0 | Blocked | Добавить рекомендацию эксперта | TR-030 | Рекомендации: пилотировать, доработать, отложить, остановить |
| TR-034 | P1 | Blocked | История скорингов | TR-341 | Сохраняются оценщик, дата, значения, комментарий, итоговое решение |
| TR-035 | P0 | Blocked | Реализовать ручную переоценку | TR-034 | Повторная оценка создает новую версию, не удаляет старую |
| TR-340 | P0 | Blocked | Реализовать draft scoring model config | TR-030 | Веса/поля хранятся как версия draft model |
| TR-341 | P0 | Blocked | Реализовать scoring history | TR-034, TR-340 | Сохраняются evaluator, date, values, comment, model version |
| TR-342 | P0 | Blocked | Реализовать scoring validation | TR-030 | Нельзя завершить скоринг без обязательных оценок и рекомендации |
| TR-033 | P1 | Blocked | Настроить веса скоринга администратором | TR-340 | Новые веса применяются к новым расчетам; история не ломается |
| TR-036 | P1 | Blocked | Загрузить финальный регламент скоринга после публикации | External regulation | Draft-модель заменяется утвержденной без потери истории |

## Release 7. Pilot Workflow and Effect Measurement

Цель: замкнуть путь от скоринга к пилоту и решению.

| ID | Priority | Status | Task | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| TR-040 | P0 | Blocked | Создать пилот из инновации | TR-030, TR-032 | Pilot наследует trend, owner, department, scoring result |
| TR-041 | P0 | Blocked | Задать критерии успеха пилота | TR-040 | Есть metric, baseline, target, due date |
| TR-042 | P0 | Blocked | Показать статус пилотов | TR-040 | Видны active, overdue, blockers, next decisions |
| TR-043 | P0 | Blocked | Зафиксировать итоговое решение | TR-041 | Решения: эксплуатация, масштабирование, остановка, повторный пилот, отложить |
| TR-044 | P1 | Blocked | Расчет LT и CT | TR-351 | Для каждой инновации фиксируются даты создания, скоринга, старта/завершения пилота и решения |
| TR-045 | P0 | Blocked | Ручно корректировать статус и даты пилота | TR-307, TR-040 | Изменение требует comment/reason и audit log |
| TR-046 | P1 | Blocked | Единый журнал управленческих решений | TR-354 | Решения по trend/innovation/hypothesis/pilot/case имеют автора, дату, rationale, next step |
| TR-047 | P1 | Blocked | Оценка потребности пилота в ресурсах | TR-355 | У пилота есть roles, FTE/effort, budget estimate или причина отсутствия оценки |
| TR-350 | P0 | Blocked | Реализовать pilot blocker tracking | TR-042 | Блокеры классифицированы и видны руководителю |
| TR-351 | P1 | Blocked | Рассчитать LT/CT | TR-044 | Фиксируются даты создания, скоринга, старта/завершения пилота, решения |
| TR-352 | P1 | Blocked | Связать пилот с ValueMetric | TR-055, TR-041 | Pilot хранит effect type, baseline, target, actual, confidence |
| TR-353 | P1 | Blocked | Сформировать business case из успешного пилота | TR-060, TR-043 | Создается case с problem, solution, effect, constraints, contacts |
| TR-354 | P1 | Blocked | Реализовать Decision model/API/list view | TR-046, TR-123, TR-305 | Decision поддерживает entity_type/entity_id, decided_by, rationale, next_review_date и audit log |
| TR-355 | P1 | Blocked | Реализовать resource estimate fields для pilot | TR-047, TR-040 | Ресурсная оценка хранится версионно и не превращается в сложное бюджетирование MVP |

## Release 8. KPI, Value Scorecard, Executive Dashboards

Цель: показать компании, что портал управляет KPI и value, а не просто хранит карточки.

| ID | Priority | Status | Task | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| TR-003 | P0 | Blocked | Сводка KPI 1.3 | TR-050, TR-051 | Dashboard показывает quarter scoring, pilots, roadmap adherence |
| TR-050 | P0 | Blocked | Отчет выполнения KPI 2026 | TR-030, TR-040 | >=3 scoring на департамент/квартал и минимум один пилот |
| TR-051 | P0 | Blocked | Соблюдение дорожной карты | TR-302 | Целей достигнуто / целей поставлено; threshold >=80% |
| TR-052 | P1 | Blocked | Квартальный отчет | TR-362 | Экспорт/представление содержит KPI, решения, топ трендов, пилоты, риски и блокеры |
| TR-053 | P1 | Blocked | Причины нереализуемости | TR-361 | Dashboard показывает доли и динамику по причинам |
| TR-054 | P0 | Blocked | Value scorecard портала | TR-352 | Revenue pipeline, cost avoided, risk reduction, market position, employee value |
| TR-055 | P1 | Blocked | Связать пилот с выручкой или экономией | TR-352 | У пилота есть тип эффекта, baseline, target, факт и confidence |
| TR-056 | P1 | Blocked | Вклад портала в рейтинг и репутацию | TR-363 | Учитываются публикации, выступления, кейсы, награды, employer brand indicators |
| TR-360 | P0 | Blocked | KPI dashboard empty/loading/error states | TR-003, TR-100 | UI состояния проверены в браузере |
| TR-361 | P1 | Blocked | Dashboard причин нереализуемости | TR-053, TR-333 | Доли и динамика причин остановки/нереализуемости |
| TR-362 | P1 | Blocked | Квартальный отчет | TR-052 | Экспорт/представление содержит KPI, решения, топ трендов, пилоты, риски |
| TR-363 | P1 | Blocked | Reputation/rating contribution view | TR-056 | Учитываются публикации, выступления, кейсы, награды, employer indicators |

## Release 9. Employee Value and Adoption

Цель: сделать портал полезным сотруднику, чтобы он возвращался сам.

| ID | Priority | Status | Task | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| TR-072 | P2 | Backlog | Вовлеченность подразделений | TR-375 | Метрики: авторы идей, эксперты, участники пилотов, просмотры кейсов |
| TR-073 | P0 | Backlog | Страница "Мои тренды" | TR-304, TR-320 | Тренды по роли, департаменту, навыкам, подпискам и открытым пилотам |
| TR-074 | P0 | Backlog | Статус своей идеи | TR-330, TR-334 | Employee видит status, owner, next step, feedback due date, history |
| TR-075 | P0 | Backlog | Полезный ответ при отклонении идеи | TR-333, TR-332 | Отклонение содержит причину, экспертный комментарий, возможность доработки |
| TR-076 | P1 | Blocked | Профиль вклада сотрудника | TR-371 | Профиль показывает идеи, review, пилоты, кейсы, экспертные комментарии и признание |
| TR-077 | P1 | Blocked | Связь тренда с навыками и обучением | TR-372 | У тренда есть skill map, рекомендуемые материалы, внутренние эксперты и пилоты |
| TR-078 | P1 | Blocked | Поиск релевантных трендов, идей, пилотов и кейсов | TR-376 | Поиск и фильтры работают по роли, подразделению, продукту, технологии, навыку и статусу |
| TR-370 | P0 | Blocked | Реализовать personal trend relevance rules | TR-073 | Релевантность строится по role, department, skills, subscriptions |
| TR-371 | P0 | Blocked | Реализовать профиль вклада MVP | TR-076, TR-304 | Видны идеи, reviews, pilots participation, comments |
| TR-372 | P1 | Blocked | Skill map для тренда | TR-077, TR-010 | У тренда есть skills, learning links, internal experts |
| TR-373 | P1 | Blocked | Открытые пилоты для участия | TR-040, TR-073 | Employee видит pilots, где нужен вклад |
| TR-374 | P1 | Blocked | Персональный digest MVP | TR-073 | Digest по подпискам/роли без внешних уведомлений на первом этапе |
| TR-375 | P1 | Blocked | Метрики employee value | TR-054, TR-073 | Idea feedback SLA, repeat contributors, skill coverage, pilot participation |
| TR-376 | P1 | Blocked | Реализовать global search MVP | TR-078, TR-320, TR-331, TR-042, TR-061 | Search индексирует published trends, innovations, pilots, cases и поддерживает измерение search success |

## Release 10. Governance, Sources, Closed/Open Contour Preparation

Цель: подготовить расширение источников без преждевременного open collector.

| ID | Priority | Status | Task | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| TR-080 | P1 | Backlog | Связь инновации с задачей в Jira/портфеле | Future integration decision | У карточки есть внешняя ссылка и статус синхронизации |
| TR-081 | P2 | Backlog | Ручная загрузка внешних сигналов трендов | TR-381 | Система хранит источник, дату, краткое содержание, связанный тренд |
| TR-090 | P0 | Blocked | Реестр проверенных источников | TR-123 | Source has domain, URL, type, trust level, owner, frequency |
| TR-091 | P1 | Blocked | Ручная загрузка пакета внешних сигналов | TR-381 | Система принимает JSON/CSV по схеме, показывает ошибки валидации и пишет импорт в audit log |
| TR-092 | P0 | Blocked | Review внешнего сигнала | TR-090 | Signal не публикуется без review |
| TR-093 | P1 | Blocked | Проверка подписи, hash и схемы import batch | TR-383 | Невалидные пакеты блокируются до попадания в staging |
| TR-094 | P1 | Blocked | Связать сигнал с существующим трендом | TR-382 | Один сигнал может усиливать/ослаблять тренд и менять дату пересмотра |
| TR-095 | P1 | Blocked | Календарь обновлений по доменам | TR-384 | Отображается частота сбора, последний импорт, просрочки review |
| TR-096 | P2 | Backlog | Open collector для allowlist источников | TR-385 | Сборщик работает только в открытом контуре и формирует подписанный batch |
| TR-097 | P2 | Backlog | Запрет активного контента при импорте | TR-383 | Импортируются только разрешенные форматы без исполняемых вложений |
| TR-098 | P1 | Blocked | Ежемесячная повестка обновления трендов | TR-386 | Повестка содержит новые тренды, pending reviews, решения к комитету, просроченные пересмотры, кандидатов на пилоты |
| TR-380 | P0 | Blocked | Source registry admin UI | TR-090, TR-100 | Admin может создать/изменить/deactivate source |
| TR-381 | P1 | Blocked | Ручная загрузка внешних сигналов JSON/CSV | TR-091, TR-093 | Schema validation, errors, audit log |
| TR-382 | P1 | Blocked | Staging area для сигналов | TR-092 | Expert видит pending signals, approve/reject/link |
| TR-383 | P1 | Blocked | Signature/hash validation design | TR-093 | Зафиксирован формат hash/signature для import batch |
| TR-384 | P1 | Blocked | Calendar обновлений по доменам | TR-095 | Видны last import/review overdue |
| TR-385 | P2 | Blocked | Open collector MVP design | TR-096 | Отдельная architecture spec для открытого контура |
| TR-386 | P1 | Blocked | Реализовать management agenda view | TR-098, TR-046, TR-095 | Есть список решений, просрочек review, новых сигналов и кандидатов на пилот для ежемесячного контура |

## Release 11. Business Cases, Communication, Innovation Culture

Цель: связать пилоты с кейсами, обучением и культурой инноваций.

| ID | Priority | Status | Task | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| TR-060 | P1 | Blocked | Создать business case из пилота | TR-353 | Case содержит problem, solution, effect, constraints, applicability, contacts |
| TR-061 | P1 | Blocked | Поиск business cases | TR-060 | Фильтры по trend, department, effect |
| TR-062 | P2 | Backlog | Переиспользование кейсов | TR-392 | Отображается количество повторных применений и суммарный эффект |
| TR-070 | P1 | Blocked | Публикации инновационной культуры | TR-060 | Материалы связаны с трендами/кейcами |
| TR-071 | P1 | Blocked | Календарь митапов и сессий | TR-070 | События связаны с trends/initiatives/owners |
| TR-390 | P1 | Blocked | Система поощрения инновационной деятельности MVP spec | PDF seed initiative #4 | Описаны rewards/recognition mechanics для future implementation |
| TR-391 | P1 | Blocked | PR инновационной культуры MVP spec | PDF seed initiative #5 | Описаны публикации, митапы, external events |
| TR-392 | P2 | Blocked | Переиспользование кейсов | TR-062 | Видно количество повторных применений и суммарный эффект |

## Release 12. Testing, Quality, Accessibility, Release Readiness

Цель: обеспечить качество после каждой задачи и перед релизом.

| ID | Priority | Status | Task | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| TR-101 | P1 | Blocked | Провести аудит текущего UI на соответствие MOEX design system | TR-100, TR-200 | Проверены raw-цвета, кнопки, темы, состояния, визуальные расхождения; подготовлен план миграции |
| TR-400 | P0 | Blocked | Подготовить test strategy MVP | TR-203 | Unit/integration/e2e/manual/browser checks documented |
| TR-401 | P0 | Blocked | Подготовить accessibility checklist | TR-100 | Focus, keyboard, contrast, button states, aria checked |
| TR-402 | P0 | Blocked | Подготовить UX usability сценарии MVP | TR-073, TR-074 | Сценарии: найти тренд, предложить идею, посмотреть статус |
| TR-403 | P0 | Blocked | Подготовить regression checklist | TR-400 | Покрывает trend CRUD, seed, scoring, idea status, KPI |
| TR-404 | P0 | Blocked | Подготовить release readiness checklist | TR-400 | Security, audit, data, UI, docs, known risks |
| TR-405 | P1 | Blocked | Провести аудит UI на MOEX DS | TR-101 | Нарушения и план миграции без автоматической правки UI |

## P2 / Future backlog

Эти задачи не входят в MVP, но должны сохраняться как roadmap.

| ID | Priority | Status | Task | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| TR-500 | P2 | Backlog | Подключить биржевые и финансовые тренды | TR-017 | Domain `exchange_finance`, sources, owners, review workflow |
| TR-501 | P2 | Backlog | Подключить regulatory/resilience domains | Roadmap stage 3 | Regulatory obligation classification, cyber/resilience alerts |
| TR-502 | P2 | Backlog | Подключить HR domain | Roadmap stage 4 | Skills, learning, org/culture signals |
| TR-503 | P2 | Backlog | Подключить product/client/macro/ESG domains | Roadmap stage 5 | Full corporate trend map |
| TR-504 | P2 | Backlog | AI-assisted trend drafts | TR-082 | Drafts require manual review |
| TR-505 | P2 | Backlog | Forecast innovations | TR-083 | Forecast has confidence and sources |
| TR-082 | P2 | Backlog | AI-черновик описания тренда | TR-504 | Черновик не публикуется без ручного подтверждения |
| TR-083 | P2 | Backlog | Прогнозные инновации | TR-505 | Прогноз помечен уровнем уверенности и источниками |
| TR-506 | P2 | Backlog | Jira/portfolio integration | TR-080 | External link/status sync without breaking closed contour |
| TR-507 | P2 | Backlog | Automatic presentation export | TR-052 | Export follows approved reporting format |
| TR-508 | P2 | Backlog | Marketplace/reuse of business cases | TR-062 | Cases reusable across departments |
| TR-084 | P2 | Backlog | Ресурсные и бюджетные ограничения портфеля | TR-047 | Есть укрупненный обзор потребности в ресурсах/бюджете по пилотам и инициативам |

## Next recommended tasks

1. `TR-201`: создать backend skeleton на TypeScript.
2. `TR-203`: настроить lint/typecheck/test baseline после backend skeleton.
