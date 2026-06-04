# Seed Data

## Назначение

Эта директория хранит версионируемые source files для стартового наполнения MVP. Файлы здесь не являются результатом публикации данных в портал: загрузка, staging/review, audit log и ручная корректировка реализуются отдельными задачами.

## Правила

- PDF-derived seed должен ссылаться на `docs/13-source-traceability.md`.
- Каждая запись должна сохранять source PDF, raw text reference, source number and source section.
- Нумерация из источника сохраняется без перенумерации.
- Не исправлять неоднозначности источника молча; сохранять raw comment and traceability note.
- Проверка seed source contract запускается командой `pnpm seed:check`.
- Генерация идемпотентного load artifact запускается командой `pnpm seed:load`.

## Files

- `strategic-initiatives.seed.json`: 7 стратегических инициатив из PDF для будущего seed loader.
- `primary-technology-trends.seed.json`: 10 первичных технологических трендов/инноваций из PDF; source number `9` intentionally absent.
- `generated/portal-seed.load.json`: deterministic loader output with 17 records, per-record `source_trace`, stable `seed_key` and source hash. This artifact is ready for the future SQLite/Prisma upsert step and remains unchanged on repeated loader runs while source data is unchanged.
