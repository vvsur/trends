# UI Route Contract: Corporate Trends Portal Implemented Baseline

All UI work must follow `docs/10-design-system-ui-rules.md`, use MOEX `.skills` tokens/themes/components, support light/dark/inverted themes, and include browser checks when UI changes are made.

## Implemented Routes

| Route | Primary User | Implemented Purpose | Required States |
| --- | --- | --- | --- |
| `/` | Any portal user | Redirects to the trend radar | redirect |
| `/trends` | Portal user | Technology trend list with URL-backed filters by domain, status, owner, and department | loading, empty, error, success |
| `/trends/:id` | Portal user | Trend detail with core fields, source traceability area, and empty linked sections for innovations, pilots, and metrics | loading, missing id, not found/error, success |
| `/innovations` | Portal user | Implemented strategic initiative list from PDF seed data, despite broader navigation label | loading, empty, error, success |

## Placeholder Routes

These routes exist in navigation and render a generic module skeleton. They must not be treated as completed business workflows in planning or acceptance.

| Route | Navigation Label | Current Purpose |
| --- | --- | --- |
| `/scoring` | Скоринг | Skeleton module summary only |
| `/pilots` | Пилоты | Skeleton module summary only |
| `/kpi` | KPI | Skeleton module summary only |
| `/cases` | Кейсы | Skeleton module summary only |
| `/my-trends` | Мои тренды | Skeleton module summary only |

## Interaction Rules

- Trend list filters must remain reflected in the page address.
- Trend detail must show source traceability text when present and a clear absence message when not present.
- Strategic initiative list must expose source number/seed key traceability.
- Placeholder routes must remain visually bounded as next-step/skeleton surfaces and must not imply that scoring, pilot, KPI, case, or employee workflows are complete.
- Theme controls in the shell must keep implemented routes usable in light, dark, and inverted states.
