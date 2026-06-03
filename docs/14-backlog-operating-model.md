# Backlog Operating Model

## Назначение

Этот документ задает правила формирования backlog и работы с задачами при реализации портала. Он обязателен для product, design, engineering, QA, analytics и будущих AI/code agents.

## Принципы

- Backlog должен быть ordered list работы, а не складом идей.
- Каждая задача должна иметь понятную ценность для компании, сотрудника или процесса.
- Нельзя брать задачу в реализацию без предварительного анализа.
- После каждой реализации обязателен анализ результата и тестирование.
- Discovery и delivery идут параллельно, но не смешиваются: discovery готовит validated work, delivery реализует готовые задачи.
- MVP не должен раздуваться: первый этап фокусируется на IT/technology domain, ручном вводе, seed-импорте PDF, скоринге, KPI и employee value.
- Любая задача, затрагивающая UI, должна учитывать UX и MOEX design system rules.

## Типы backlog items

| Тип | Когда использовать | Обязательные поля |
| --- | --- | --- |
| User Story | Пользовательская возможность | роль, потребность, ценность, acceptance criteria |
| Spike / Research | Анализ неизвестного перед реализацией | вопрос, метод анализа, ожидаемый output, timebox |
| Technical Enabler | Инфраструктура, архитектура, качество | цель, зависимые stories, DoD, риски |
| Data Task | Импорт, миграция, seed, справочники | источник, схема, правила валидации, audit |
| UX Task | Исследование, прототип, usability test | гипотеза, аудитория, сценарии, критерии успеха |
| QA Task | Тест-план, регрессия, проверка качества | scope, test cases, evidence |
| Governance Task | Правила, регламенты, роли, security | владелец, decision log, affected docs |

## Шаблон задачи

```md
## Title

Короткое действие + объект.

## Type

User Story | Spike | Technical Enabler | Data Task | UX Task | QA Task | Governance Task

## Goal

Какую проблему решаем и почему это важно.

## Value

- Company value:
- Employee value:
- Process/risk value:

## Context

Ссылки на документы, PDF traceability, решения, ограничения.

## Scope

Что входит.

## Out of scope

Что сознательно не делаем.

## Acceptance Criteria

Проверяемые критерии.

## Analysis Plan

Что нужно проанализировать до реализации.

## Implementation Notes

Ключевые технические/продуктовые решения.

## Test Plan

Как проверяем после реализации.

## UX Check

Что проверяем с точки зрения удобства сотрудника.

## Documentation Updates

Какие документы обновить.
```

## Definition of Ready

Задачу можно брать в реализацию только если:

- понятна ценность: company value, employee value или process/risk value;
- есть владелец задачи;
- есть acceptance criteria;
- есть analysis plan;
- есть test plan;
- известны зависимости;
- известен affected scope;
- UI-задача имеет UX check и ссылку на MOEX design system rules;
- data-задача имеет источник данных и правила валидации;
- задача помещается в разумный implementation slice;
- если задача идет из PDF-контекста, есть ссылка на `docs/13-source-traceability.md`.

## Definition of Done

Задача считается done только если:

- проведен предварительный анализ;
- реализация выполнена в согласованном scope;
- выполнены acceptance criteria;
- проведено тестирование;
- проведен post-implementation analysis;
- обновлена документация, если изменилась логика, UX, API, модель данных или процесс;
- нет незадокументированных решений;
- для UI выполнена браузерная проверка на текущем разрешении;
- для UI соблюдены MOEX design system rules;
- для backend соблюдено TypeScript-ограничение;
- для frontend соблюдено React-ограничение.

## Цикл работы над каждой задачей

Каждая задача проходит один и тот же цикл:

1. Intake: понять источник задачи, ценность и тип.
2. Analysis: изучить документацию, текущую реализацию, ограничения и best practices.
3. Refinement: уточнить scope, acceptance criteria, test plan, dependencies.
4. Implementation: выполнить только согласованный scope.
5. Self-review: проверить изменения на соответствие acceptance criteria и архитектуре.
6. Testing: запустить релевантные проверки, тесты, browser/UX checks.
7. Result analysis: оценить, что изменилось, какие риски остались, что нужно в backlog.
8. Documentation update: обновить docs/backlog/decision log при необходимости.

## Командный workflow статусов

Для командной работы используется workflow из `docs/16-team-workflow.md`.

Ключевые правила:

- перед началом работы задача переводится в `In Progress`;
- если задача требует уточнения, она переводится в `Discovery`;
- если работа остановлена внешним фактором, задача переводится в `Blocked`;
- после реализации задача проходит `In Review` и `Testing`;
- в `Done` задача попадает только после выполнения Definition of Done;
- текущие статусы в репозитории можно вести в `docs/17-task-board.md`, пока не подключен внешний issue tracker.
- test evidence фиксируется в формате `docs/21-test-evidence-format.md`.

## Правило "беру в работу"

Исполнитель, включая AI/code agent, перед началом реализации обязан явно указать:

- какую задачу берет;
- почему задача ready;
- какие файлы/модули затрагивает;
- какой план проверки будет использовать;
- кто assignee и reviewer, если reviewer известен.

После этого задача считается `In Progress`.

## Правило анализа до реализации

Перед любой реализацией нужно ответить:

- какую проблему решаем;
- для кого это важно;
- на какие документы опираемся;
- какие данные/модели/интерфейсы затронуты;
- какие UX-риски есть;
- какие тесты докажут, что задача выполнена;
- не конфликтует ли задача с MVP-срезом, стеком, MOEX design system, закрытым контуром и ручной корректировкой.

## Правило анализа после реализации

После реализации нужно ответить:

- выполнены ли acceptance criteria;
- улучшилась ли ценность для компании или сотрудника;
- не ухудшилась ли простота ручной корректировки;
- не нарушены ли правила audit log;
- не появился ли ad hoc UI;
- какие тесты запущены и что они показали;
- какие новые риски/долги появились;
- какие follow-up задачи нужно добавить в backlog.

## Приоритизация

Приоритет считается по четырем измерениям:

| Измерение | Вопрос |
| --- | --- |
| Strategic fit | Двигает ли KPI 1.3, PDCA, 2026 MVP или стратегию 2026-2030? |
| Company value | Влияет ли на выручку, эффективность, риск, market position, reputation? |
| Employee value | Делает ли портал полезнее для сотрудника лично? |
| Delivery risk | Снижает ли неопределенность, dependency или технический риск? |

P0 ставится только задачам, без которых MVP не сможет доказать ценность или быть безопасно реализован.

## Backlog refinement cadence

- Еженедельно: refinement ближайших задач, проверка Definition of Ready.
- Перед стартом каждой задачи: короткий task analysis.
- После завершения каждой задачи: result analysis и test evidence.
- Формат evidence: `docs/21-test-evidence-format.md`.
- Ежемесячно: сверка backlog с KPI, value scorecard, employee value и PDF traceability.
- Ежеквартально: пересмотр roadmap, доменов, метрик и стратегического fit.

## UX-gate для задач

Любая задача, влияющая на интерфейс сотрудника, должна пройти UX-gate:

- понятен пользователь и сценарий;
- экран отвечает на вопрос "что это значит для меня";
- нет лишнего ручного ввода;
- есть clear next action;
- статус и последствия действия понятны;
- есть состояние пустого списка, ошибки, loading, недоступности;
- интерфейс проверен на текущем разрешении;
- light, dark и inverted темы не ломают восприятие;
- кнопки и states соответствуют MOEX design system.

## Data-gate для задач

Любая задача с данными должна пройти data-gate:

- известен источник данных;
- известна обязательность полей;
- есть схема валидации;
- есть поведение при ошибке импорта;
- есть audit log;
- ручная корректировка доступна;
- seed из PDF не теряет исходные поля и нумерацию.

## Источники практик

- Scrum.org Scrum Glossary: Product Backlog и Product Backlog refinement. https://www.scrum.org/resources/scrum-glossary
- Scrum Guide: Definition of Done и готовность Product Backlog items к Sprint Planning. https://scrumguides.org/scrum-guide.html
- Agile Alliance INVEST: Independent, Negotiable, Valuable, Estimable, Small, Testable. https://www.agilealliance.org/glossary/invest/
- Dual-track agile practices: discovery и delivery как параллельные контуры. https://www.producttalk.org/2012/10/the-dual-track-agile/
- Nielsen Norman Group usability testing: проверка интерфейса через наблюдение за реальными сценариями. https://www.nngroup.com/articles/usability-testing-101/
