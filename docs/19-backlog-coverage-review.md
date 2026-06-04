# Backlog Coverage Review

## Назначение

Документ фиксирует проверку, что требования и смысловые блоки из проектной документации заведены в backlog. Проверка выполнена после формирования `docs/18-full-implementation-backlog.md`.

## Проверенные источники

| Документ | Покрытие backlog |
| --- | --- |
| `docs/01-materials-analysis.md` | KPI 1.3, PDCA, инициативы, риски, метрики покрыты TR-022, TR-030..TR-036, TR-040..TR-047, TR-050..TR-056, TR-390..TR-391 |
| `docs/02-market-analysis.md` | Лучшие практики тренд/гипотеза/пилот/эффект, короткая карточка, scoring, pipeline и business cases покрыты TR-010..TR-017, TR-020..TR-026, TR-030..TR-036, TR-040..TR-047, TR-060..TR-062 |
| `docs/03-product-concept.md` | Модули портала, MVP, ручное управление, домены, value scorecard, employee value, MOEX DS, стек и SQLite storage baseline покрыты TR-001..TR-006, TR-010..TR-026, TR-040..TR-056, TR-073..TR-078, TR-090..TR-098, TR-100..TR-102, TR-128 |
| `docs/05-data-model.md` | Сущности данных и SQLite storage baseline покрыты implementation tasks TR-128, TR-299..TR-308, TR-336..TR-337, TR-354..TR-355 |
| `docs/06-trend-domains-and-refresh.md` | Домены, источники, формат пакетов, staging, review, manual override и open collector покрыты TR-004, TR-017, TR-090..TR-098, TR-380..TR-386, TR-500..TR-503 |
| `docs/07-architecture.md` | Закрытый/открытый контур, стек, SQLite storage baseline, validation, импорт, безопасность и этапы развертывания покрыты TR-090..TR-098, TR-120..TR-128, TR-200..TR-207, TR-380..TR-386 |
| `docs/08-implementation-roadmap.md` | Этапы IT -> finance -> regulatory -> HR -> product/ESG -> collector -> AI покрыты TR-016, TR-017, TR-500..TR-508 |
| `docs/09-independent-value-analysis.md` | Company value, employee value, UX principles, value metrics и adoption risks покрыты TR-054..TR-056, TR-072..TR-078, TR-360..TR-376 |
| `docs/10-design-system-ui-rules.md` | MOEX design system подключение и аудит UI покрыты TR-100, TR-101, TR-126, TR-401, TR-405 |
| `docs/11-technology-stack.md` | React frontend, TypeScript backend, API и SQLite/Prisma storage baseline покрыты TR-102, TR-120, TR-121, TR-122, TR-123, TR-128 |
| `docs/12-implementation-readiness-review.md` | Предстартовые решения и первый implementation slice покрыты TR-100, TR-120..TR-128, TR-200..TR-207 |
| `docs/13-source-traceability.md` | PDF traceability, seed initiatives, seed trends and scoring regulation gap покрыты TR-022, TR-036, TR-310..TR-315 |
| `docs/14-backlog-operating-model.md` | Backlog rules, DoR/DoD, analysis/test cycle, UX/data gates покрыты TR-110, TR-112, TR-126, TR-400..TR-404 |
| `docs/15-required-expertise-and-skills.md` | Required skills and gates покрыты TR-111, TR-127 |
| `docs/16-team-workflow.md` | Status workflow, WIP limits, board rules covered by TR-113, TR-114 |
| `docs/17-task-board.md` | Текущие статусы ближайших задач синхронизированы с TR-100, TR-120..TR-125, TR-022, TR-073..TR-075, TR-116 |

## Найденные пробелы и добавленные задачи

| Пробел | Почему важно | Добавлено |
| --- | --- | --- |
| `Hypothesis` была в концепции и PDF traceability, но не была отдельной backlog/data-model задачей | Без гипотезы теряется связка trend -> innovation -> проверяемое предположение -> pilot | TR-025, TR-336, `Hypothesis` в `docs/05-data-model.md` |
| Ранние ограничения ИБ/архитектуры/инфраструктуры были в целях, но не как отдельная карточная функция | Это ключевой механизм снижения риска до пилота | TR-026, TR-337, `RiskConstraint` в `docs/05-data-model.md` |
| Decision был в data model, но не было единого журнала решений | Управленческий контур должен хранить rationale и next step, а не только статус пилота | TR-046, TR-354 |
| Ресурсы и бюджет были отмечены как риск/частичное покрытие | MVP не должен делать сложное бюджетирование, но ресурсную емкость пилота нужно видеть | TR-047, TR-084, TR-355, `ResourceEstimate` в `docs/05-data-model.md` |
| Search success rate и экономия времени сотрудника были метриками value, но не имели отдельной функции поиска | Без поиска портал будет менее полезен сотруднику | TR-078, TR-376 |
| Ежемесячная повестка и решения на комитет были в концепции, но не отдельной задачей | Нужен рабочий управленческий контур, а не только отчеты | TR-098, TR-386 |
| Storage baseline был изменен с PostgreSQL на SQLite и требовал синхронизации документов/backlog | Без явной задачи старый PostgreSQL baseline мог вернуться в implementation tasks | TR-128, TR-299 |

## Механическая сверка

Проверка строк таблиц backlog:

- `docs/04-backlog.md`: все product backlog items имеют уникальные ID.
- `docs/18-full-implementation-backlog.md`: все implementation backlog items имеют уникальные ID.
- каждый product backlog ID из `docs/04-backlog.md` представлен отдельной строкой в `docs/18-full-implementation-backlog.md`.

Команда проверки:

```bash
python3 - <<'PY'
from pathlib import Path
import re
rows = {}
for file in ['docs/04-backlog.md', 'docs/18-full-implementation-backlog.md']:
    ids = []
    for line in Path(file).read_text().splitlines():
        m = re.match(r'\| (TR-\d{3}) \|', line)
        if m:
            ids.append(m.group(1))
    rows[file] = sorted(set(ids))
missing = [x for x in rows['docs/04-backlog.md'] if x not in rows['docs/18-full-implementation-backlog.md']]
print(f"product={len(rows['docs/04-backlog.md'])} implementation={len(rows['docs/18-full-implementation-backlog.md'])} missing={missing}")
PY
```

## Вывод

После добавления TR-025, TR-026, TR-046, TR-047, TR-078, TR-084, TR-098, TR-116, TR-128 и соответствующих implementation tasks документация покрыта backlog достаточно для старта реализации. Storage baseline для MVP выровнен на SQLite + Prisma ORM/Migrate; PostgreSQL остается только future alternative через отдельный ADR. Следующий риск не в полноте backlog, а в выполнении ближайшего data foundation: TR-299, затем TR-300/TR-301.
