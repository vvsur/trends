# ADR 0001: Frontend build tool/framework

## Status

Accepted

## Date

2026-06-03

## Backlog

TR-120: выбрать frontend build tool/framework поверх React.

## Context

MVP корпоративного портала трендов - закрытое рабочее приложение для IT/technology trends, ручного ввода, реестра инноваций, скоринга, пилотов, KPI и employee value workflows. Frontend уже ограничен React, а backend должен быть отдельным TypeScript-контуром.

В MVP не требуется публичный SEO, SSR, React Server Components или full-stack React runtime. Главные требования к frontend foundation:

- быстрый local dev loop для маленьких вертикальных срезов;
- TypeScript-first skeleton;
- понятная интеграция с отдельным backend API;
- совместимость с MOEX design system skills из `.skills`;
- минимальная магия вокруг server/client boundaries до принятия backend/API/storage решений;
- возможность собрать статические assets для закрытого контура.

Официальная документация React рекомендует начинать новые React apps с framework, но также явно допускает build-from-scratch path, когда ограничения приложения не подходят готовому full-stack framework. Vite официально поддерживает `react-ts` template, быстрый dev server/HMR и production build static assets.

## Decision

Frontend MVP будет создан как React + TypeScript SPA на Vite.

Implementation baseline для будущей TR-200:

- build tool: `vite`;
- template: `react-ts`;
- React plugin: official Vite React plugin selected during scaffold;
- app rendering model: client-side SPA;
- routing: React Router as a client routing library in the frontend skeleton, without adopting React Router full-stack framework mode unless a later ADR changes this;
- styling/design system: only MOEX design system tokens/recipes from `.skills`, no ad hoc UI kit or raw color layer;
- backend integration: frontend consumes the separate TypeScript backend API selected in TR-121/TR-122.

## Alternatives Considered

### Next.js App Router

Pros:

- full React framework with App Router, Server Components, routing, layouts and production conventions;
- strong ecosystem and deployment options.

Cons for this MVP:

- overlaps with the required separate TypeScript backend decision;
- introduces server/client component boundaries before API, storage and RBAC are decided;
- SSR/RSC/SEO value is low for the closed internal portal MVP;
- higher architectural surface for audit, closed-contour deployment and manual workflow slices.

### React Router framework mode

Pros:

- official React ecosystem option that can be paired with Vite;
- good route/data conventions.

Cons for this MVP:

- full-stack framework mode adds server runtime choices before TR-121/TR-122;
- MVP needs a separate backend API boundary and audit/RBAC decisions first.

### Parcel or RSbuild

Pros:

- valid modern build-tool alternatives.

Cons for this MVP:

- less direct fit with the simplest React + TypeScript skeleton path already supported by Vite templates;
- fewer project-specific benefits compared with Vite for this closed SPA.

## Consequences

Positive:

- TR-200 can scaffold a small React + TypeScript frontend quickly.
- Frontend remains cleanly separated from backend/API decisions.
- Static assets can be served in a closed contour behind the internal gateway.
- MOEX design system integration stays frontend-local and explicit.

Trade-offs:

- No SSR, React Server Components or framework-level data loading in MVP.
- Route-level data fetching, auth guards and error states must be designed in app code and shared API contracts.
- If future public pages, SEO-heavy content, SSR, or React Server Components become valuable, this ADR must be revisited.

## Implementation Notes

- TR-200 should create the frontend under the repository structure chosen by TR-202.
- TR-200/TR-203 should include `dev`, `build`, `preview`, `lint`, `typecheck` and test baseline commands where applicable.
- Vite currently requires modern Node versions; TR-121/TR-202 should align Node runtime constraints across frontend and backend.
- Browser checks remain mandatory for UI work after skeleton and must include light, dark and inverted theme verification once theme shell exists.

## Sources

- React docs: Creating a React App - https://react.dev/learn/creating-a-react-app
- Vite docs: Getting Started - https://vite.dev/guide/
- Next.js docs: App Router - https://en.nextjs.im/docs/app/
