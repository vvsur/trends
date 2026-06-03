# Required Expertise and Skills

## Назначение

Для реализации портала нужны не только engineering skills. Продукт строится на стыке trend intelligence, корпоративного процесса, UX, данных, безопасности и delivery. Этот документ фиксирует обязательную экспертизу, которую нужно привлекать при анализе и реализации задач.

## Обязательные экспертные роли

| Skill / роль | Зачем нужна | Когда подключать |
| --- | --- | --- |
| Product Owner / Product Manager | Приоритизация, value, scope, MVP, связь с KPI 1.3 | Все backlog/refinement решения |
| Trend Analyst | Анализ трендов, источников, сигналов, доменов, relevance | Trend/domain/source задачи |
| Innovation Process Expert | PDCA, скоринг, пилоты, решения об эксплуатации | Scoring, pilot, governance задачи |
| UX Researcher | Пользовательские сценарии, "Мои тренды", feedback по идеям, usability | До UI-задач и после первого прототипа |
| UX/UI Designer | Информационная архитектура, экраны, states, дизайн-система | Все UI-задачи |
| MOEX Design System Expert | Токены, темы, кнопки, запрет ad hoc UI | До и во время UI-разработки |
| Frontend Engineer | React implementation, accessibility, browser checks | Frontend задачи |
| Backend Engineer | TypeScript backend, API, domain logic, audit log | Backend/API задачи |
| Data/Analytics Engineer | Seed import, validation, metrics, dashboards | Data/KPI/value tasks |
| QA Engineer | Test strategy, regression, acceptance evidence | Все delivery задачи |
| Security / Architecture Expert | Closed contour, import gateway, audit, access rules | Architecture, source import, roles |
| HR / Learning Expert | Skill map, обучение, employee value, мотивация | Employee value и HR-домены |
| Business Domain Expert | Биржевые/финансовые/продуктовые домены | Начиная со второго этапа |

## Skill gates

| Gate | Кто должен участвовать | Что проверяется |
| --- | --- | --- |
| Trend gate | Trend Analyst + Domain Expert | Источник, релевантность, домен, влияние, владелец |
| UX gate | UX Researcher + UX/UI Designer | Пользователь, сценарий, понятность, полезность, usability |
| Design system gate | MOEX DS Expert + Frontend | Токены, темы, кнопки, states, browser check |
| Data gate | Data/Analytics + Backend | Схема, обязательные поля, validation, audit, ручная корректировка |
| Value gate | Product + Business owner | Company value, employee value, KPI/value metric |
| Security gate | Security/Architecture | Closed contour, access, import safety, audit |
| QA gate | QA + Engineer | Acceptance criteria, automated/manual tests, regression |

## Специализированные рабочие skills для AI/code agents

Если будущий исполнитель использует AI/code agent, он должен применять следующие режимы экспертизы:

### Trend Analysis Skill

Использовать при задачах по трендам, источникам, доменам, скорингу и seed-данным.

Обязательные действия:

- читать `docs/13-source-traceability.md`;
- не терять исходный PDF-контекст;
- проверять домен, источник, владельца и влияние;
- отличать trend, signal, innovation, hypothesis и pilot;
- не считать draft scoring финальным регламентом.

### UX Expertise Skill

Использовать при любой задаче, влияющей на сотрудника или интерфейс.

Обязательные действия:

- начинать с пользовательского сценария;
- проверять employee value;
- проектировать clear next action;
- учитывать "Мои тренды", статус идеи, feedback SLA, профиль вклада;
- проверять пустые, loading, error, disabled и permission states;
- проводить browser check после UI-изменений.

### Design System Skill

Использовать после подключения `.skills`.

Обязательные действия:

- читать `.skills/skills/foundations-tokens/tokens.yaml`;
- читать `.skills/skills/foundations-tokens/decision-guide.yaml`;
- использовать `.skills/skills/foundations-themes/SKILL.md`;
- использовать `.skills/skills/component-button/SKILL.md`;
- не использовать ad hoc colors/states/buttons.

### Delivery Quality Skill

Использовать при каждой implementation task.

Обязательные действия:

- перед кодом провести analysis;
- после кода провести self-review;
- запустить релевантные тесты;
- обновить документацию;
- зафиксировать follow-up backlog items.

### Data Governance Skill

Использовать при seed, import, metrics, audit log и source tasks.

Обязательные действия:

- сохранять source fields;
- валидировать обязательные поля;
- сохранять audit trail;
- поддерживать ручную корректировку;
- не терять нумерацию и traceability PDF.

## Когда skill обязателен

| Тип задачи | Обязательные skills |
| --- | --- |
| Trend CRUD | Trend Analysis, Data Governance, Delivery Quality |
| Seed import | Trend Analysis, Data Governance, QA |
| "Мои тренды" | UX Expertise, Trend Analysis, Delivery Quality |
| Idea feedback | UX Expertise, Delivery Quality |
| Scoring | Innovation Process, Data Governance, QA |
| Pilot workflow | Innovation Process, Value gate, QA |
| Dashboard / KPI | Data Governance, Value gate, UX Expertise |
| UI component | UX Expertise, Design System, Frontend, QA |
| Open collector | Trend Analysis, Security, Data Governance |

