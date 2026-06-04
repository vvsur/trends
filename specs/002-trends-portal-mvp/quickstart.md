# Quickstart: Implemented Baseline Validation

## Scope

This guide validates the code that already exists for the implemented baseline. It does not describe future workflows for innovation scoring, pilots, KPI dashboards, source review, business cases, or employee My Trends.

## Prerequisites

- Node.js 24 LTS and pnpm 11.x as declared in the root package.
- Dependencies installed for the monorepo.
- Working branch: `002-trends-portal-mvp`.
- Feature artifacts present under `specs/002-trends-portal-mvp/`.

## Static And Automated Checks

```bash
pnpm typecheck
pnpm build
pnpm lint
pnpm test
pnpm contract:check
pnpm seed:check
pnpm db:validate
pnpm db:migrate:status
```

Expected outcome: all commands complete without errors in a correctly prepared local environment.

## Seed Publication Scenario

1. Publish seed data.

   ```bash
   pnpm seed:publish
   ```

2. Verify strategic initiatives are available through the implemented initiative list behavior.
3. Verify primary technology trends are available through the trend list behavior.
4. Verify source traceability is attached to seed-created records.
5. Verify source trend numbering preserves the missing item number 9.

Expected outcome: seed publication is idempotent, traceable, and does not renumber PDF-derived records.

## Trend Radar Scenario

1. Start backend and frontend development servers.

   ```bash
   pnpm run dev
   ```

2. Open `/trends`.
3. Verify the trend list shows title, description, status, domain, maturity, recommendation, owner, and review date.
4. Apply each implemented filter: domain, status, owner, and department.
5. Reset filters.
6. Open `/trends/:id` from a list row.
7. Verify trend detail shows core fields, source traceability area, and empty linked sections for innovations, pilots, and metrics.

Expected outcome: implemented trend list/detail behavior works and handles loading, empty, and error states.

## Trend Mutation And Audit Scenario

1. Use an authorized local MVP actor with trend editing capability.
2. Create a trend through the implemented trend mutation behavior.
3. Update the trend with a non-empty reason.
4. Attempt the same update without a reason.
5. Attempt mutation as an actor without the required capability.

Expected outcome: valid mutation succeeds and writes audit history; missing reason and unauthorized actor are rejected.

## Reference Data Governance Scenario

1. List a supported reference dictionary.
2. Create a dictionary item as an authorized administrator.
3. Update the item with a reason.
4. Deactivate the item with a reason.
5. Attempt mutation without admin capability.

Expected outcome: reference data mutations require admin capability, update/deactivate require a reason, and controlled changes write audit history.

## Strategic Initiative List Scenario

1. Open `/innovations`.
2. Verify the page displays PDF-derived strategic initiatives, not a full innovation pipeline.
3. Verify each visible item includes title, department, period, owner, optional comment, seed key, and source-number badge where available.
4. Verify loading, empty, and error states.

Expected outcome: the implemented initiative register is accurately represented as a seed initiative list.

## Placeholder Module Scenario

1. Open `/scoring`, `/pilots`, `/kpi`, `/cases`, and `/my-trends`.
2. Verify each route renders a skeleton module summary.
3. Verify none of these pages presents a completed workflow.

Expected outcome: future modules are navigable placeholders only.

## UI Verification

For implemented UI routes:

- Check loading, empty/no data, error, and success states where applicable.
- Check light, dark, and inverted themes.
- Scan for raw colors in CSS/TS/TSX outside MOEX token definitions.
- Capture browser evidence at the current resolution when UI changes are made.

Expected outcome: implemented UI follows MOEX design system rules and remains usable across required states.
