<!--
Sync Impact Report
Version change: unratified template -> 1.0.0
Modified principles:
- Template Principle 1 -> I. Value-Led MVP Scope
- Template Principle 2 -> II. Manual Control, Audit, And Traceability
- Template Principle 3 -> III. Delivery Discipline
- Template Principle 4 -> IV. Stack And Architecture Boundaries
- Template Principle 5 -> V. Employee, Company, And UX Value
Added sections:
- Product And Data Constraints
- Delivery And Quality Gates
Removed sections:
- Template placeholder sections and example comments
Templates requiring updates:
- updated: .specify/templates/plan-template.md
- updated: .specify/templates/spec-template.md
- updated: .specify/templates/tasks-template.md
- not present: .specify/templates/commands/*.md
Deferred follow-ups:
- None
-->
# Corporate Trends Portal Constitution

## Core Principles

### I. Value-Led MVP Scope

Work MUST protect the product objective: a closed corporate trends portal that
supports KPI 1.3, PDCA governance, and the 2026 technology-trends MVP before
broader automation or domain expansion. The MVP MUST focus on IT/technology
trends, manual input, PDF seed publication, trend governance, employee value,
and visible company value. New work MUST keep discovery/research tasks separate
from delivery tasks and MUST avoid expanding MVP scope without an explicit
backlog or architecture decision.

Rationale: the project exists to replace scattered presentations and lists with
a measurable working process, not to accumulate speculative platform features.

### II. Manual Control, Audit, And Traceability

Manual creation and correction MUST remain available for governed business data.
Published corrections MUST require a non-empty reason when the affected behavior
is a correction, status change, decision, delete, or admin override. Manual,
seed, import, and system changes MUST preserve an audit trail with actor,
source, changed fields, versions, and focused before/after values where
applicable. PDF-derived seed data MUST follow docs/13-source-traceability.md,
including source fields and original numbering gaps. Automation, AI summaries,
and imports MUST NOT overwrite manual corrections without owner confirmation.

Rationale: the portal is a governance system. Its data must remain explainable,
correctable, and traceable back to source materials and human decisions.

### III. Delivery Discipline

Every implementation task MUST follow the repository delivery cycle: analysis,
implementation within agreed scope, self-review, testing or verification, result
analysis, and documentation update when behavior, UX, API, data model, or
process changes. A task MUST NOT enter implementation unless it satisfies
Definition of Ready: value, scope, acceptance criteria, analysis plan, test
plan, dependencies, and affected scope are known. Task status MUST reflect
reality; blocked work MUST be marked Blocked or Discovery instead of remaining
hidden in In Progress. Completion MUST include test evidence or an explicit
statement of checks that could not be run.

Rationale: the project uses auditability not only for data, but also for how
work moves through the backlog.

### IV. Stack And Architecture Boundaries

Frontend application code MUST use React. Backend product code, domain logic,
APIs, and integration services MUST use TypeScript. The MVP storage baseline is
SQLite through Prisma ORM/Migrate. PostgreSQL, another primary frontend stack,
or another primary backend stack MUST NOT be introduced without a separate ADR,
migration plan where data is affected, and backlog update. The closed corporate
portal MUST NOT depend on direct internet access. Open collection and transfer
from external sources MUST remain separate from the closed contour and MUST use
safe, validated packages.

Rationale: explicit technology boundaries keep the MVP buildable, reviewable,
and compatible with the closed-contour architecture.

### V. Employee, Company, And UX Value

Feature specifications and backlog items MUST make user value explicit. Company
value MUST remain visible through KPI, revenue, efficiency, risk, market
position, reputation, or governance impact. Employee value MUST remain visible
through My Trends, idea status, feedback SLA, contribution visibility, skills,
learning, or practical next action. UI work MUST use MOEX design system skills,
tokens, themes, and component recipes from .skills and
docs/10-design-system-ui-rules.md. UI work MUST support light, dark, and
inverted themes and include a browser check at the current resolution.

Rationale: the portal succeeds only if it is useful to leadership and to the
employees who contribute ideas, reviews, pilots, and expertise.

## Product And Data Constraints

- The final scoring regulation MUST NOT be invented; it can be implemented only
  after the source regulation is published or explicitly approved as a draft
  model.
- The old BPMN diagram from source PDFs MUST NOT be implemented as a process
  authority without owner confirmation.
- Seed/import work MUST preserve source traceability, source fields, validation
  rules, and audit records.
- Future trend domains beyond technology MAY be prepared in reference data, but
  activation MUST be governed and traceable.
- AI-assisted analytics and open-collector automation MUST remain reviewed
  inputs, not sources of final truth.

## Delivery And Quality Gates

- Before implementation, contributors MUST read the project documents relevant
  to the task: product concept, backlog, data model, architecture, technology
  stack, readiness review, operating model, required expertise, and source
  traceability for PDF or seed work.
- UI tasks MUST pass UX, design-system, accessibility/state, and browser checks.
- Data tasks MUST pass source, schema, validation, audit, and manual-correction
  checks.
- API/backend tasks MUST keep consistent error shapes, RBAC boundaries, audit
  behavior, and TypeScript contracts.
- Backlog and documentation MUST be updated when implementation reveals a new
  decision, risk, or follow-up.

## Governance

This constitution is the highest project-level rule set for Spec Kit feature
work. AGENTS.md and docs/14-backlog-operating-model.md provide operational
detail and MUST remain consistent with this constitution.

Amendments MUST be explicit documentation changes. Each amendment MUST include a
version bump, ratification or amendment date, impact on Spec Kit templates, and
any required backlog or AGENTS.md updates.

Versioning follows semantic versioning:

- MAJOR for incompatible principle removals or redefinitions.
- MINOR for new principles, new mandatory gates, or materially expanded rules.
- PATCH for clarifications that do not change obligations.

Plans, specs, tasks, and implementation reviews MUST check compliance with the
principles above. Any conflict with a MUST rule requires changing the feature
artifact or creating an explicit governance/architecture amendment before
implementation proceeds.

**Version**: 1.0.0 | **Ratified**: 2026-06-04 | **Last Amended**: 2026-06-04
