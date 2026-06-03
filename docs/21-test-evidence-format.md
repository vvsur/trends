# Test Evidence Format

## Назначение

Документ задает минимальный формат evidence после каждой implementation-задачи. Он нужен, чтобы task board, review и будущий issue tracker одинаково показывали, что именно было проверено, какими командами, на каком артефакте и какие риски остались.

Это не полноценная test strategy MVP. Полная стратегия остается отдельной задачей `TR-400`.

## Когда заполнять

Evidence фиксируется перед переводом задачи в `Done`, после self-review и тестирования.

Минимально evidence должно быть в одном из мест:

- `docs/17-task-board.md` в поле `Notes`, если задача маленькая;
- PR/commit summary, если внешний review идет через GitHub;
- отдельный файл или ticket comment, если проверка содержит много screenshots/manual steps.

## Короткий шаблон

```text
Task: <ID> <title>
Scope checked:
- <что проверено по acceptance criteria>

Commands:
- <command> -> pass|fail|not run (<reason>)

Browser/UI:
- not applicable
или
- viewport: <width>x<height>, route: <path>, theme: <light|dark|inverted>, screenshot: <path/link>, result: pass|fail

Manual checks:
- <короткая проверка> -> pass|fail|not run

Result analysis:
- AC: met|partial|not met
- Docs/backlog: updated|not needed
- Residual risks: <none or list>
- Follow-ups: <none or backlog IDs>
```

## Команды

Для текущего workspace baseline использовать доступные команды:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm contract:check
git diff --check
```

Если команда не применима или еще не настроена, писать `not run` и причину. Не скрывать пропущенную проверку.

## Browser/UI Evidence

Для UI-задач evidence обязательно содержит:

- проверенный route или сценарий;
- viewport текущей проверки;
- темы: light/dark/inverted, если UI затрагивает shell, tokens, states или цветовую иерархию;
- результат по horizontal overflow, читаемости текста, active/hover/pressed/focus или тем states, которые менялись;
- путь или ссылку на screenshot, если screenshot создавался.

Минимальные browser checks для UI:

- текущий desktop viewport;
- mobile viewport для layout/navigation;
- light/dark/inverted states для theme-sensitive изменений.

## Data/Seed Evidence

Для seed/import задач evidence должно ссылаться на `docs/13-source-traceability.md` и показывать:

- source document/page/row;
- transformation rule;
- validation command or manual validation;
- что не было опубликовано без review, если есть staging/import flow;
- audit/source fields, которые сохраняют происхождение данных.

## API Evidence

Для API задач evidence должно показывать:

- contract/schema update, если менялся публичный API;
- `pnpm contract:check`, если OpenAPI/generated types затронуты;
- unit/integration command;
- пример endpoint/route, если проверялся вручную;
- ограничения RBAC/audit/manual correction, если endpoint меняет данные.

## Residual Risks

Residual risks писать коротко и предметно:

- `none`, если существенных известных рисков нет;
- `follow-up <ID>`, если риск уже превращен в backlog item;
- `blocked by <owner/decision>`, если без внешнего решения нельзя завершить acceptance criteria.

## Связанные документы

- `docs/14-backlog-operating-model.md`
- `docs/16-team-workflow.md`
- `docs/17-task-board.md`
- `docs/10-design-system-ui-rules.md`
- `docs/13-source-traceability.md`
