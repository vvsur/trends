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
- Use `docs/16-team-workflow.md` for statuses, WIP limits and team workflow.
- Use `docs/17-task-board.md` as the repository task board until an external issue tracker is connected.
- A task is not ready unless it has value, scope, acceptance criteria, analysis plan and test plan.
- Use INVEST as a quality check for user stories.
- Keep discovery/research tasks separate from delivery tasks.
- Update backlog/docs when implementation reveals new decisions, risks or follow-ups.

## Task status rules

- Before starting implementation, explicitly say: `Taking task: <ID/title>`.
- If the task board is used, move the task to `In Progress`, set assignee and update `updated_at`.
- If analysis shows the task is not ready, move it to `Discovery` or `Blocked` and explain why.
- Do not keep blocked work hidden inside an `In Progress` status.
- After implementation, move through self-review/testing and mark `Done` only when Definition of Done is met.

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
