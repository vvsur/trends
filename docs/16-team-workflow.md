# Team Workflow and Backlog Status Rules

## Назначение

Этот документ задает командные правила движения задач по backlog. Он дополняет `docs/14-backlog-operating-model.md`: там описано качество задач, здесь - статусы, ответственность и прозрачность работы.

## Принципы командной работы

- Статус задачи должен отражать реальность, а не желаемое состояние.
- В каждый момент понятно, кто владелец задачи и кто исполнитель.
- Работа не должна зависать без явного blocked-статуса.
- WIP должен быть ограничен: лучше закончить начатое, чем параллельно открыть слишком много задач.
- Любое движение задачи сопровождается коротким комментарием: что изменилось, что проверено, что осталось.
- Если задача меняет scope, acceptance criteria или приоритет, это считается backlog refinement, а не молчаливая правка.

## Статусы задач

| Статус | Значение | Кто переводит | Условия перехода |
| --- | --- | --- | --- |
| `Backlog` | Идея или задача зафиксирована, но не готова к работе | Product / команда | Есть title, value, примерный scope |
| `Discovery` | Идет анализ, research, UX, spike или уточнение | Product / analyst / designer / engineer | Нужны ответы перед delivery |
| `Ready` | Задача готова к реализации | Product / команда после refinement | Выполнен Definition of Ready |
| `In Progress` | Исполнитель взял задачу в работу | Исполнитель | Перед началом реализации есть analysis note |
| `In Review` | Реализация завершена, идет review/self-review | Исполнитель / reviewer | Есть changes, test evidence, summary |
| `Testing` | Идет QA, browser check, acceptance verification | QA / исполнитель | Есть build/changes для проверки |
| `Done` | Задача соответствует Definition of Done | Product / reviewer / исполнитель по договоренности | AC выполнены, тесты пройдены, docs обновлены |
| `Blocked` | Работа не может двигаться без внешнего решения | Исполнитель | Указаны blocker, owner, next action, дата пересмотра |
| `Deferred` | Задача сознательно отложена | Product | Указана причина и условие возврата |
| `Cancelled` | Задача больше не нужна | Product | Указана причина отмены |

## Минимальные поля для командной работы

Каждая задача должна иметь:

- `id`: например `TR-073`;
- `title`;
- `type`;
- `priority`;
- `status`;
- `owner`: кто отвечает за ценность и решение;
- `assignee`: кто делает сейчас;
- `reviewer`: кто принимает результат, если применимо;
- `created_at`;
- `updated_at`;
- `target_release` или `milestone`;
- `links`: связанные документы, PR, design, decisions;
- `blocked_reason`, если status = `Blocked`;
- `done_evidence`: тесты, screenshots, ссылки, summary по формату `docs/21-test-evidence-format.md`.

## WIP limits

Рекомендуемые ограничения:

| Статус | WIP limit |
| --- | --- |
| `Discovery` | Не больше 3 задач на домен/команду |
| `In Progress` | Не больше 1 задачи на исполнителя |
| `In Review` | Не больше 5 задач на команду |
| `Testing` | Не больше 5 задач на команду |

Если WIP превышен, команда сначала помогает завершить или разблокировать текущую работу.

## Правила переходов

### Backlog -> Discovery

Переход допустим, если:

- задача важна для MVP, roadmap или снижения риска;
- есть вопрос, который нужно исследовать;
- назначен owner исследования;
- задан ожидаемый output.

### Discovery -> Ready

Переход допустим, если:

- выполнен analysis;
- scope достаточно мал;
- acceptance criteria проверяемы;
- есть test plan;
- понятны dependencies;
- UI/data/security gates определены.

### Ready -> In Progress

Перед переводом исполнитель обязан:

- написать короткую analysis note;
- подтвердить scope;
- назвать affected files/modules;
- назвать plan проверки;
- убедиться, что нет активной задачи у этого же исполнителя, если WIP limit = 1.

### In Progress -> In Review

Переход допустим, если:

- implementation завершена;
- self-review проведен;
- тесты/проверки выполнены или явно указано, что не удалось запустить;
- документация обновлена при необходимости.

### In Review -> Testing

Переход допустим, если:

- reviewer не видит явных blocker issues;
- есть testable artifact;
- понятен scope тестирования.

### Testing -> Done

Переход допустим, если:

- acceptance criteria выполнены;
- Definition of Done выполнен;
- test evidence зафиксирован по `docs/21-test-evidence-format.md`;
- residual risks описаны;
- follow-up задачи созданы или добавлены в backlog.

### Any -> Blocked

Перевести в `Blocked` нужно сразу, если:

- нет доступа;
- нет решения владельца;
- не опубликован внешний регламент;
- зависимость не готова;
- тестирование невозможно;
- дальнейшая работа приведет к догадкам вместо реализации.

Blocked-задача должна иметь:

- причину;
- владельца разблокировки;
- следующий шаг;
- дату пересмотра.

## Правила для AI/code agent

Когда AI/code agent берет задачу:

1. Явно сообщить: `Беру в работу: <ID/title>`.
2. Проверить Definition of Ready.
3. Если задача не готова, перевести ее в `Discovery` или `Blocked` и объяснить почему.
4. Перед изменениями дать короткий analysis note.
5. Во время работы считать задачу `In Progress`.
6. После реализации провести self-review и testing.
7. Перед финальным ответом указать:
   - что сделано;
   - какие acceptance criteria закрыты;
   - что проверено;
   - какие риски остались;
   - какие follow-up задачи появились.
8. Если ведется task board в документации или issue tracker, обновить статус задачи.

## Task board в репозитории

Пока нет внешнего issue tracker, командный статус можно вести в `docs/17-task-board.md`.

Правила:

- `docs/04-backlog.md` хранит product backlog и acceptance criteria.
- `docs/17-task-board.md` хранит текущие статусы и движение задач.
- В task board не дублируются длинные acceptance criteria.
- При изменении статуса обновляется `updated_at`.
- Done-задачи остаются в task board до конца итерации, затем переносятся в release notes/changelog.

## Источники практик

- Kanban University Kanban Guide: visualize workflow, make policies explicit, limit WIP. https://kanban.university/kanban-guide/
- Atlassian workflow statuses: workflow status describes where a work item is in the process. https://support.atlassian.com/jira-cloud-administration/docs/what-is-a-workflow-status/
- Atlassian WIP limits: WIP limits constrain the amount of work in each status to improve flow. https://www.atlassian.com/agile/kanban/wip-limits
- Scrum Guide: Product Backlog transparency and Definition of Done. https://scrumguides.org/scrum-guide.html
