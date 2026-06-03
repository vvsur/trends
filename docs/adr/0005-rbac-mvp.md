# ADR 0005: MVP RBAC roles and policies

## Status

Accepted

## Date

2026-06-03

## Backlog

TR-124: определить RBAC и роли MVP.

## Context

MVP требует ручной ввод, ручную корректировку, review imported/staged data, scoring, pilot decisions, dashboards and employee value workflows. При этом все изменения должны быть audit-friendly, а управленческие решения должны фиксировать человека.

RBAC должен:

- поддерживать employee self-service without exposing privileged actions;
- различать create/edit/review/decision/admin capabilities;
- работать с domain/department/entity ownership;
- требовать reason для manual correction where product rules require it;
- быть достаточно простым для MVP skeleton.

## Decision

MVP использует RBAC с базовыми ролями и scope-aware assignments.

Core roles:

- `employee`: default authenticated user;
- `trend_owner`: owns trends/innovations/hypotheses within assigned domain/department/entity scope;
- `expert`: scores innovations, reviews signals/data and records expert comments/constraints within assigned scope;
- `executive`: reads KPI/value dashboards and records management decisions within assigned scope;
- `admin`: manages users, role assignments, reference data and source registry configuration.

Role assignment supports optional scope:

- global;
- domain;
- department;
- entity, for example one trend, innovation or pilot.

Frontend may hide unavailable actions, but backend policies are authoritative.

## Permission Matrix

| Capability | employee | trend_owner | expert | executive | admin |
| --- | --- | --- | --- | --- | --- |
| View published trends/innovations/pilots/cases | yes | yes | yes | yes | yes |
| View own idea status/history | yes | yes | yes | yes | yes |
| Create idea/innovation proposal | yes | yes | yes | yes | yes |
| Edit own draft idea before review | yes | yes | yes | no | yes |
| Create/edit trend in assigned scope | no | yes | no | no | yes |
| Publish trend or imported data | no | yes, with review evidence | yes, if reviewer in scope | no | yes, operational override |
| Create/edit hypothesis in assigned scope | no | yes | yes | no | yes |
| Score innovation | no | no | yes | no | yes, operational override |
| Add expert comment or constraint | no | no | yes | no | yes |
| Create/edit pilot in assigned scope | no | yes | no | no | yes |
| Record pilot/final management decision | no | no | recommendation only | yes | yes, operational override |
| View KPI/value dashboards | limited personal/team | assigned scope | assigned scope | yes | yes |
| Manage reference data | no | no | no | no | yes |
| Manage sources/import settings | no | no | no | no | yes |
| Manage users/roles | no | no | no | no | yes |
| Manual correction of published/imported data | own drafts only | assigned scope with reason | assigned review scope with reason | decision records with reason | yes with reason |

## Policy Rules

- Every authenticated user receives `employee`.
- Mutations require an authenticated actor; no anonymous writes.
- Role checks must include scope checks where a role assignment has scope.
- Published/imported data correction requires a non-empty reason.
- System/import actors can create staging records but cannot publish without human review.
- Admin override is operational, not a substitute for product ownership; override actions still require reason and audit log.
- Executive decision actions must store `decided_by`, `decision_date`, `rationale` and next step/review where applicable.
- Security, architecture and infrastructure reviewers are represented as scoped `expert` assignments with constraint-specific responsibility.
- Source administrator is represented as scoped/global `admin` for source registry settings in MVP.

## Data Model Implications

Add/confirm these model concepts:

- `User`: authenticated person or service actor;
- `RoleAssignment`: user, role, optional scope type/scope id, active flag;
- `EmployeeProfile`: employee-facing profile data linked to `User`;
- domain entities keep owner refs to `User`;
- audit log records actor user/service id and role/scope context used for authorization.

## Consequences

Positive:

- MVP can protect manual correction, scoring and management decisions early.
- Employee value scenarios remain open to all authenticated users.
- Domain/department ownership can grow without changing the role model.

Trade-offs:

- TR-305 must implement policy checks, not just role string checks.
- UI states need permission-aware empty/disabled/action states.
- External corporate identity integration remains a later decision; MVP can seed local users/roles.

## Implementation Notes

- TR-201/TR-202 may start with local seeded users for development.
- TR-304 should implement `User` and `EmployeeProfile`.
- TR-305 should implement scoped RBAC middleware/policies.
- TR-306/TR-307/TR-125 should record authorization/audit context for mutations.
- TR-330/TR-334/TR-073 must preserve employee self-service access.
