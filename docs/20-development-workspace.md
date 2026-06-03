# Development Workspace

## Назначение

Документ фиксирует базовую структуру workspace для frontend/backend реализации MVP.

## Runtime

- Node.js: `>=24 <27`.
- Package manager: `pnpm@11.5.1`.
- Frontend decision: Vite + React + TypeScript SPA, ADR `docs/adr/0001-frontend-build-tool.md`.
- Backend decision: Node.js 24 LTS + Fastify + TypeScript, ADR `docs/adr/0002-backend-runtime-framework.md`.

After installing Node.js 24 LTS, enable the package manager through Corepack:

```bash
corepack enable
corepack prepare pnpm@11.5.1 --activate
pnpm --version
```

## Structure

```text
apps/
  frontend/       React frontend skeleton
  backend/        Fastify backend skeleton
packages/
  api-contract/   Generated/shared API contract types, TR-204
```

## Root Commands

Root scripts delegate to workspace packages and use `--if-present`, so they are safe before every package has its final scripts.

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
pnpm test
pnpm lint
```

## Notes

- Application code is intentionally not created in TR-202.
- TR-200 added frontend dependencies, Vite scripts, placeholder routes and MOEX token CSS.
- TR-201 added backend dependencies, Fastify app factory, `/api/v1/health` and a health endpoint test.
- TR-203 turns these placeholder-safe root commands into enforced lint/typecheck/test baseline.
- TR-204 adds OpenAPI/generated TypeScript contract workflow under `packages/api-contract`.
