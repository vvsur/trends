# ADR 0007: MVP current actor and local auth context

## Status

Accepted

## Date

2026-06-04

## Backlog

TR-129: определить MVP current actor/auth context.

## Context

Protected API mutations need a current actor before TR-002 and later CRUD tasks can safely use RBAC and write audit events. Corporate identity integration is still an open product/architecture question, but ADR 0005 allows MVP to seed local users and roles.

## Decision

MVP backend uses a local closed-contour auth shim:

- requests identify the actor with `X-Trends-Actor-Email`;
- the backend resolves that email against local `User` and active `RoleAssignment` records in SQLite;
- inactive or unknown users are treated as unauthenticated;
- RBAC policies remain authoritative for protected actions;
- audit records use the resolved local user id and role/scope context;
- corporate SSO/password/session integration is out of scope until a separate ADR.

For local development and tests, the database seeds an admin actor:

- email: `admin@trends.local`;
- role: `admin`;
- scope: `global`.

## Consequences

Positive:

- protected API routes can be implemented without inventing actor data per endpoint;
- audit log can store a real actor id from the first CRUD slice;
- future corporate identity can replace only the resolver boundary while preserving RBAC policies.

Trade-offs:

- the header-based shim is not production authentication;
- external identity, sessions, CSRF and password management remain separate decisions;
- clients must send `X-Trends-Actor-Email` for protected API calls until the identity layer is replaced.

## Implementation Notes

- TR-002 may use the current actor resolver with RBAC `manage_reference_data`.
- Future UI calls should use the local admin actor only in dev/test mode.
- Production deployment must not rely on a user-controlled header without a trusted gateway or identity provider.
