# ADR 0006: Audit log and entity versioning

## Status

Accepted

## Date

2026-06-03

## Backlog

TR-125: определить формат audit log и versioning.

## Context

Product rules require manual input and manual correction at every stage, imported data review before publication, protection from automatic overwrite and a visible audit trail for manual and automated changes. Management decisions must always record the person who made the decision.

Audit/versioning must support:

- trend, innovation, hypothesis, scoring, pilot, metric, decision, source, signal and import batch changes;
- before/after visibility;
- actor, role/scope context and reason;
- manual, seed, import, system and admin override sources;
- optimistic concurrency for edited entities;
- future reporting and compliance checks.

## Decision

MVP uses append-only audit events plus per-entity version counters.

Core rule:

- every auditable mutation writes the business change and its `AuditEvent` in one database transaction;
- every auditable entity has an integer `version` incremented on each update;
- API update commands must include expected version once optimistic locking is implemented;
- delete should be soft delete/deactivate for business entities unless an explicit data-retention decision allows hard delete.

## AuditEvent Fields

| Field | Meaning |
| --- | --- |
| `id` | UUID |
| `event_type` | create/update/delete/status_change/review/publish/import/seed/correction/decision/admin_override |
| `entity_type` | trend/innovation/hypothesis/scoring/pilot/metric/decision/business_case/source/external_signal/import_batch/reference_data/user/role_assignment |
| `entity_id` | UUID/string of changed entity |
| `entity_version_before` | version before mutation, nullable for create |
| `entity_version_after` | version after mutation, nullable for delete |
| `actor_id` | user/service actor id |
| `actor_type` | user/system/import/seed |
| `actor_role` | role used for authorization, nullable for system |
| `actor_scope` | authorization scope used for mutation, nullable |
| `source` | manual/import/seed/system/admin |
| `reason` | required for correction, admin override, decision and destructive/status changes |
| `before` | JSON snapshot or field-level object before mutation |
| `after` | JSON snapshot or field-level object after mutation |
| `changed_fields` | string array for quick display/filtering |
| `correlation_id` | request/import batch/job id |
| `created_at` | timestamp |

## Tracked Entities

Audit is mandatory for:

- `Trend`;
- `Innovation`;
- `Hypothesis`;
- `Scoring`;
- `Pilot`;
- `Metric` / `ValueMetric`;
- `Decision`;
- `BusinessCase`;
- `RiskConstraint`;
- `Source`;
- `ExternalSignal`;
- `ImportBatch`;
- reference data: departments, domains, statuses, maturity/recommendation;
- `User` and `RoleAssignment`.

## Reason Rules

`reason` is required for:

- manual correction of published/imported data;
- status change after review/scoring/pilot start;
- scoring reassessment;
- pilot date/status correction;
- management decision;
- admin override;
- destructive migration/data repair actions.

`reason` is optional for:

- initial draft create;
- employee idea proposal;
- non-published draft edit by owner.

## Versioning Rules

- Auditable tables include `version int not null default 1`.
- Updates increment version by 1.
- API update DTOs include `expectedVersion` for entities edited by users.
- Version conflict returns a standard conflict error once TR-308 defines API errors.
- Audit event stores before/after versions even if field snapshots are redacted.
- Imported/staged records keep source hash/import batch id separately from entity version.

## Security and Privacy Rules

- Audit events are append-only at application level.
- Audit events are not edited through normal admin UI.
- Sensitive fields must be redacted or summarized in `before`/`after` snapshots.
- Audit views are permission-filtered: employees see their own idea history, owners/experts see assigned scope, executives/admins see broader scope.
- System/import/seed actors must be distinguishable from human users.

## Consequences

Positive:

- Manual correction remains accountable from the first CRUD implementation.
- Entity history can be shown without reconstructing state from database backups.
- Optimistic locking reduces accidental overwrites.
- Seed/import traceability can later attach to the same event model.

Trade-offs:

- Every mutation path must go through an auditable service/repository layer.
- Snapshot size can grow; TR-306 should keep snapshots focused and redact sensitive fields.
- Reporting may need indexes on entity, actor, event type, source and created date.

## Implementation Notes

- TR-306 should implement audit write helpers inside the same transaction as business mutations.
- TR-307 should enforce reason-required manual correction.
- TR-308 should define conflict/error envelope for version mismatch.
- TR-312 seed loader should create seed/import audit events after audit infrastructure exists.
- TR-354 decision model should use both `Decision` records and `AuditEvent` decision events.
