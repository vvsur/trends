# Agent Working Rules

## Scope

These rules apply to all future implementation work in this repository.

## Mandatory workflow for every task

Every task must follow:

1. Analysis before implementation.
2. Implementation within the agreed scope.
3. Self-review after implementation.
4. Testing / verification.
5. Result analysis and documentation update.

Do not jump directly to code. Even small tasks require a brief analysis of scope, affected files and verification.

## Read before implementation

Before implementation, read the relevant documents:

- `docs/03-product-concept.md`
- `docs/04-backlog.md`
- `docs/05-data-model.md`
- `docs/07-architecture.md`
- `docs/10-design-system-ui-rules.md` for UI work
- `docs/11-technology-stack.md`
- `docs/12-implementation-readiness-review.md`
- `docs/13-source-traceability.md` for seed/PDF-related work
- `docs/14-backlog-operating-model.md`
- `docs/15-required-expertise-and-skills.md`

## Backlog rules

- Use `docs/14-backlog-operating-model.md` as the operating model.
- A task is not ready unless it has value, scope, acceptance criteria, analysis plan and test plan.
- Use INVEST as a quality check for user stories.
- Keep discovery/research tasks separate from delivery tasks.
- Update backlog/docs when implementation reveals new decisions, risks or follow-ups.

## Product rules

- MVP focuses on IT/technology trends.
- Manual input and manual correction are mandatory.
- Seed data from PDF must follow `docs/13-source-traceability.md`.
- Do not invent the final scoring regulation; the source PDF says it will be published later.
- Old BPMN from PDF must not be implemented without owner confirmation.
- Employee value is mandatory: "My Trends", idea status, feedback SLA and contribution visibility matter.
- Company value is mandatory: KPI, revenue, efficiency, risk, market position and reputation must remain visible.

## Stack rules

- Frontend must use React.
- Backend must use TypeScript.
- Do not introduce another primary frontend/backend stack without an explicit architecture decision.

## UI rules

- Before active UI development, execute backlog item TR-100: connect MOEX design system skills as `.skills` and update this file with the MOEX registry/rules.
- Until `.skills` is connected, do not invent final UI tokens, colors, button variants or themes.
- After `.skills` is connected, all UI work must follow `docs/10-design-system-ui-rules.md`.
- Every UI change must include a browser check at the current resolution.

## Quality rules

- Preserve auditability for manual and automated changes.
- Keep source traceability for imported/seed data.
- Do not remove user changes without explicit request.
- Prefer small vertical slices.
- After every implementation task, report what was tested and what remains risky.
