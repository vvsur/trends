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
| TR-100 | Подключить MOEX design system skills и закрепить правила UI-разработки | Ready | P0 | TBD | TBD | 2026-06-03 | Первый recommended implementation slice; до выполнения не начинать активную UI-разработку |
| TR-110 | Закрепить правила формирования backlog и работы с задачами | Done | P0 | Product | Codex | 2026-06-03 | Зафиксировано в `docs/14-backlog-operating-model.md` |
| TR-111 | Закрепить обязательные skills/expertise для реализации портала | Done | P0 | Product | Codex | 2026-06-03 | Зафиксировано в `docs/15-required-expertise-and-skills.md` |
| TR-112 | Добавить рабочие правила для implementation agents | Done | P0 | Product | Codex | 2026-06-03 | Зафиксировано в `AGENTS.md` |
| TR-113 | Закрепить командный workflow статусов backlog | Done | P0 | Product | Codex | 2026-06-03 | Зафиксировано в `docs/16-team-workflow.md` |
| TR-114 | Вести task board для командной работы до подключения issue tracker | Done | P0 | Product | Codex | 2026-06-03 | Зафиксировано в `docs/17-task-board.md` |
| TR-102 | Зафиксировать и соблюдать ограничения стека: React frontend, TypeScript backend | Done | P0 | Architecture | Codex | 2026-06-03 | Зафиксировано в `docs/11-technology-stack.md` |
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
