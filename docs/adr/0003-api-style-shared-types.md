# ADR 0003: API style and shared types contract

## Status

Accepted

## Date

2026-06-03

## Backlog

TR-122: выбрать API style и контракт shared types.

## Context

Frontend MVP выбран как Vite + React + TypeScript SPA. Backend MVP выбран как Node.js 24 LTS + Fastify + TypeScript. Портал работает в закрытом контуре и должен поддерживать manual CRUD, audit log, RBAC, seed/import validation, scoring, pilots and dashboards.

API foundation должен:

- быть понятным для frontend, backend, QA and future integrations;
- поддерживать schema validation для request/response;
- давать машинно-читаемый контракт для generated TypeScript types;
- не связывать frontend и backend runtime слишком плотно;
- оставлять место для import gateway and future external/internal consumers.

## Decision

MVP использует REST JSON API with OpenAPI contract.

Implementation baseline для TR-204:

- API style: REST over HTTP with JSON request/response bodies;
- URL versioning: `/api/v1`;
- canonical contract: OpenAPI 3.0.3 generated from trusted Fastify route schemas;
- backend schema authoring: TypeBox schemas where practical, registered as Fastify route schemas;
- backend validation: Fastify validates requests and serializes responses from those schemas;
- frontend shared types: generated from OpenAPI with `openapi-typescript`;
- frontend API access: typed fetch wrapper or `openapi-fetch` may be added in TR-204, no handwritten duplicate DTO types;
- internal backend/domain types may be separate from API DTOs when audit, persistence or security boundaries require it;
- GraphQL, tRPC and generated SDKs for other languages are out of MVP scope.

OpenAPI 3.1+ can be revisited later. For MVP, OpenAPI 3.0.3 is selected because it is directly aligned with the documented `@fastify/swagger` dynamic generation path for Fastify v5, while still being supported by `openapi-typescript`.

## Contract Rules

- Every public API operation must have a stable `operationId`.
- Every request body, params, query and response body must have a schema.
- Error responses must use one shared error envelope once TR-308 defines API error conventions.
- Audit-sensitive mutation endpoints must accept or derive a `reason` where required by TR-005/TR-006/TR-125.
- API DTOs must not expose internal-only fields, secrets, raw imported active content or unreviewed external data.
- Contract generation should run in CI once TR-203/TR-204 exist.

## Alternatives Considered

### GraphQL

Pros:

- flexible querying;
- strong schema model;
- useful for complex cross-entity dashboards.

Cons for this MVP:

- more moving parts for authorization, audit semantics, caching and mutation discipline;
- less straightforward for seed/import validation and operation-level audit trails;
- higher frontend/backend complexity before core CRUD and RBAC exist.

### tRPC

Pros:

- excellent TypeScript inference between frontend and backend;
- low boilerplate for a TypeScript-only app.

Cons for this MVP:

- tightly couples frontend and backend TypeScript runtime shape;
- less language-neutral and less useful for future import gateway or external issue tracker integrations;
- weaker fit for independent API documentation and contract review.

### Handwritten shared TypeScript package

Pros:

- simple at first;
- no generation step.

Cons for this MVP:

- easy to drift from runtime validation;
- does not provide API docs or contract testing surface;
- encourages sharing persistence/domain shapes with UI DTOs.

## Consequences

Positive:

- Contract is reviewable, testable and usable by QA.
- Frontend gets type safety without duplicating backend DTOs by hand.
- Backend keeps a clean boundary for audit/RBAC/import validation.
- Future integrations can consume a standard HTTP/OpenAPI contract.

Trade-offs:

- TR-204 must add contract generation and check it into the dev workflow.
- Some schema features may need to stay inside the OpenAPI 3.0.3-compatible subset.
- More explicit DTO design is required than with tRPC.

## Implementation Notes

- TR-204 should add an OpenAPI generation command and generated frontend type output location.
- TR-204 should fail checks when generated types are stale.
- TR-308 should define the shared error envelope before broad API implementation.
- TR-124/TR-125 must be reflected in mutation schemas and route hooks before business CRUD is opened.
- Import batch schemas remain separate from the public REST API contract but should use compatible JSON schema practices.

## Sources

- OpenAPI Specification - https://spec.openapis.org/oas/
- `@fastify/swagger` - https://github.com/fastify/fastify-swagger
- TypeBox - https://github.com/sinclairzx81/typebox
- openapi-typescript - https://openapi-ts.dev/introduction
