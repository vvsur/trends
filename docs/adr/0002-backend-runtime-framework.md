# ADR 0002: Backend runtime/framework

## Status

Accepted

## Date

2026-06-03

## Backlog

TR-121: выбрать TypeScript backend runtime/framework.

## Context

Backend MVP должен обслуживать закрытый корпоративный портал трендов: manual CRUD, source traceability, audit log, RBAC, seed/import validation, scoring, pilots, KPI and employee value workflows. Backend уже ограничен TypeScript, а frontend выбран как Vite + React + TypeScript SPA.

Главные требования к backend foundation:

- production runtime with current LTS support;
- TypeScript-first development and explicit production build;
- clear HTTP API boundary for frontend and future import gateway;
- request/response schema validation;
- simple composition for audit, RBAC, domain services and repositories;
- modest framework complexity for small vertical slices.

## Decision

Backend MVP будет создан на Node.js 24 LTS + Fastify + TypeScript.

Implementation baseline для будущей TR-201:

- runtime: Node.js 24 LTS;
- framework: Fastify latest stable major compatible with Node.js 24;
- language: TypeScript for backend code, domain logic, API and integration services;
- production build: compile TypeScript with `tsc`, run compiled JavaScript with Node.js;
- dev runner: may use a TypeScript dev runner in TR-201/TR-202, but production must not depend on runtime TypeScript transpilation;
- validation: use static request/response schemas registered in code, not user-provided dynamic schemas;
- module shape: start with explicit modules for health, auth/RBAC policies, audit, reference data and domain entities;
- API contract details stay in TR-122.

## Alternatives Considered

### NestJS

Pros:

- strongly opinionated architecture;
- TypeScript-first and scalable for large teams;
- guards/interceptors/modules align with enterprise patterns.

Cons for this MVP:

- higher framework surface and decorator/DI conventions before API, RBAC and storage decisions are finalized;
- default abstraction sits above Express/Fastify and can obscure the simple closed-portal API boundary;
- heavier skeleton for the first small vertical slices.

### Express

Pros:

- minimal, familiar, large ecosystem;
- simple HTTP handlers.

Cons for this MVP:

- schema validation, typed route contracts and structured plugins require more manual assembly;
- less helpful as a foundation for audit/RBAC/schema-first import work.

### Hono or edge-first runtimes

Pros:

- small and fast;
- good fit for edge/serverless deployments.

Cons for this MVP:

- closed corporate portal is expected to run as an internal service, not an edge app;
- less project-specific value than Fastify's Node.js plugin and schema ecosystem.

## Consequences

Positive:

- Single Node.js LTS line can be aligned across frontend tooling and backend.
- Fastify provides a small HTTP core with typed route support and schema validation.
- Audit/RBAC/import hooks can be implemented as explicit plugins or request lifecycle hooks.
- The backend remains independent from the React frontend framework.

Trade-offs:

- Fastify is less batteries-included than NestJS, so TR-201/TR-202 must define project structure clearly.
- API contract generation/OpenAPI/shared types are not solved by this ADR and remain TR-122.
- Schema definitions must be treated as trusted application code; imported/user-provided schemas must not be executed as validators.

## Implementation Notes

- TR-201 should add a health endpoint and a minimal Fastify app factory that can be tested without opening a network port.
- TR-201/TR-203 should include `dev`, `build`, `start`, `typecheck`, `test` and `lint` commands where applicable.
- TR-122 should decide whether schemas are authored as JSON Schema, TypeBox, Zod or another shared-contract approach.
- TR-123 should align migrations/seed strategy with the Fastify app lifecycle without hiding data changes from audit log requirements.
- TR-124/TR-125 should define RBAC and audit log before business CRUD endpoints.

## Sources

- Node.js Release Working Group: release schedule - https://github.com/nodejs/release
- Fastify docs: TypeScript - https://fastify.dev/docs/latest/Reference/TypeScript/
- Fastify docs: Validation and Serialization - https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/
- NestJS docs: Introduction - https://docs.nestjs.com/introduction
