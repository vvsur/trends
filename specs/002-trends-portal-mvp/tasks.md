# Tasks: Corporate Trends Portal Implemented Baseline

**Input**: Design documents from `specs/002-trends-portal-mvp/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: This task list is synchronized to already implemented code. Tasks are documentation, validation, and evidence tasks only; they must not introduce new application behavior.

**Organization**: Tasks are grouped by the implemented-baseline user stories from [spec.md](./spec.md).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other tasks because it touches different files or independent evidence.
- **[Story]**: User story label from [spec.md](./spec.md): US1 through US5.
- Every task includes at least one concrete file path.

## Phase 1: Setup (Documentation Baseline)

**Purpose**: Prepare the existing feature artifacts for implemented-baseline validation without changing application code.

- [ ] T001 Confirm the implemented-baseline scope is reflected in `specs/002-trends-portal-mvp/spec.md`
- [ ] T002 Confirm plan scope and project structure match existing modules in `specs/002-trends-portal-mvp/plan.md`
- [ ] T003 [P] Confirm implemented entities only are listed in `specs/002-trends-portal-mvp/data-model.md`
- [ ] T004 [P] Confirm implemented API paths only are listed in `specs/002-trends-portal-mvp/contracts/openapi-mvp.yaml`
- [ ] T005 [P] Confirm implemented and placeholder UI routes are separated in `specs/002-trends-portal-mvp/contracts/ui-routes.md`
- [ ] T006 Create implemented-baseline evidence section in `docs/test-evidence/002-trends-portal-mvp.md`

---

## Phase 2: Foundational (Shared Baseline Verification)

**Purpose**: Verify shared implemented foundations that support every user story.

**Critical**: Complete this phase before story-specific validation.

- [ ] T007 [P] Record current actor and RBAC baseline evidence from `apps/backend/src/shared/auth/current-actor.ts` and `apps/backend/src/shared/rbac/policies.ts` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T008 [P] Record audit reason-required baseline evidence from `apps/backend/src/shared/audit/audit-events.ts` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T009 [P] Record consistent API error baseline evidence from `apps/backend/src/shared/api-errors.ts` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T010 [P] Record persisted implemented entity coverage from `apps/backend/prisma/schema.prisma` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T011 Confirm future workflows are documented as not implemented in `specs/002-trends-portal-mvp/data-model.md`

**Checkpoint**: Shared implemented foundations are documented and ready for story-specific validation.

---

## Phase 3: User Story 1 - View The Technology Trend Radar (Priority: P1)

**Goal**: Validate the implemented trend list/detail experience and its contract.

**Independent Test**: Open `/trends`, apply/reset filters, open `/trends/:id`, and verify loading/empty/error/success states are represented.

### Validation for User Story 1

- [ ] T012 [P] [US1] Record trend list route contract coverage from `specs/002-trends-portal-mvp/contracts/openapi-mvp.yaml` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T013 [P] [US1] Record trend list UI behavior from `apps/frontend/src/pages/TrendListPage.tsx` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T014 [P] [US1] Record trend detail UI behavior from `apps/frontend/src/pages/TrendDetailPage.tsx` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T015 [US1] Record trend list/get backend behavior from `apps/backend/src/modules/trends/routes.ts` and `apps/backend/src/modules/trends/service.ts` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T016 [US1] Confirm URL-backed filters and reset behavior are described in `specs/002-trends-portal-mvp/quickstart.md`

**Checkpoint**: US1 is documented as independently validated against the implemented baseline.

---

## Phase 4: User Story 2 - Create And Correct Trend Cards With Auditability (Priority: P1)

**Goal**: Validate implemented trend create/update behavior, authorization, validation, and audit history.

**Independent Test**: Create a valid trend, update it with a reason, attempt update without a reason, and attempt mutation without required capability.

### Validation for User Story 2

- [ ] T017 [P] [US2] Record trend create/update contract coverage from `specs/002-trends-portal-mvp/contracts/openapi-mvp.yaml` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T018 [P] [US2] Record trend mutation route authorization behavior from `apps/backend/src/modules/trends/routes.ts` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T019 [US2] Record trend create/update validation and audit behavior from `apps/backend/src/modules/trends/service.ts` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T020 [US2] Record trend mutation test coverage from `apps/backend/src/modules/trends/routes.test.ts` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T021 [US2] Confirm strategic initiative correction is explicitly excluded from this baseline in `specs/002-trends-portal-mvp/spec.md`

**Checkpoint**: US2 is documented as independently validated against the implemented baseline.

---

## Phase 5: User Story 3 - Publish Traceable PDF Seed Data Into The Portal (Priority: P1)

**Goal**: Validate implemented PDF seed publication and strategic initiative listing.

**Independent Test**: Publish seed data, verify primary technology trends and 7 strategic initiatives exist, and confirm source traceability including the missing source number 9.

### Validation for User Story 3

- [ ] T022 [P] [US3] Record seed source file coverage from `data/seed/primary-technology-trends.seed.json` and `data/seed/strategic-initiatives.seed.json` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T023 [P] [US3] Record generated seed load artifact coverage from `data/seed/generated/portal-seed.load.json` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T024 [P] [US3] Record seed loader/publisher behavior from `apps/backend/src/modules/seed/seed-loader.ts` and `apps/backend/src/modules/seed/seed-publisher.ts` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T025 [US3] Record seed traceability test coverage from `apps/backend/src/modules/seed/seed-loader.test.ts` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T026 [US3] Record strategic initiative API behavior from `apps/backend/src/modules/strategic-initiatives/routes.ts` and `apps/backend/src/modules/strategic-initiatives/service.ts` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T027 [US3] Record strategic initiative UI behavior from `apps/frontend/src/pages/InitiativeListPage.tsx` in `docs/test-evidence/002-trends-portal-mvp.md`

**Checkpoint**: US3 is documented as independently validated against the implemented baseline.

---

## Phase 6: User Story 4 - Administer Reference Data With Governance (Priority: P1)

**Goal**: Validate implemented reference-data list/create/update/deactivate behavior, admin authorization, and audit.

**Independent Test**: List a dictionary, create/update/deactivate as an administrator with reason where required, and verify non-admin mutation is rejected.

### Validation for User Story 4

- [ ] T028 [P] [US4] Record reference-data contract coverage from `specs/002-trends-portal-mvp/contracts/openapi-mvp.yaml` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T029 [P] [US4] Record supported dictionary coverage from `apps/backend/src/modules/reference-data/dictionaries.ts` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T030 [US4] Record reference-data route authorization and reason behavior from `apps/backend/src/modules/reference-data/routes.ts` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T031 [US4] Record reference-data service audit behavior from `apps/backend/src/modules/reference-data/service.ts` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T032 [US4] Record reference-data test coverage from `apps/backend/src/modules/reference-data/routes.test.ts` in `docs/test-evidence/002-trends-portal-mvp.md`

**Checkpoint**: US4 is documented as independently validated against the implemented baseline.

---

## Phase 7: User Story 5 - Use The MVP Shell And Planned Module Placeholders (Priority: P2)

**Goal**: Validate the implemented app shell, theme controls, active route mapping, and skeleton placeholder modules.

**Independent Test**: Open shell routes, verify `/` redirects to `/trends`, active routes render implemented pages, placeholder routes render skeleton summaries, and theme states remain usable.

### Validation for User Story 5

- [ ] T033 [P] [US5] Record route map coverage from `apps/frontend/src/routes.ts` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T034 [P] [US5] Record app route wiring from `apps/frontend/src/App.tsx` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T035 [P] [US5] Record shell layout and theme control behavior from `apps/frontend/src/layout/AppLayout.tsx` and `apps/frontend/src/theme/theme-shell.ts` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T036 [US5] Record placeholder module behavior from `apps/frontend/src/pages/ModulePage.tsx` in `docs/test-evidence/002-trends-portal-mvp.md`
- [ ] T037 [US5] Confirm placeholder route expectations are documented in `specs/002-trends-portal-mvp/contracts/ui-routes.md`

**Checkpoint**: US5 is documented as independently validated against the implemented baseline.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final documentation consistency and non-implementation quality gates.

- [ ] T038 [P] Verify no future workflow implementation tasks remain in `specs/002-trends-portal-mvp/tasks.md`
- [ ] T039 [P] Verify no unresolved placeholders remain in `specs/002-trends-portal-mvp/spec.md`, `specs/002-trends-portal-mvp/plan.md`, and `specs/002-trends-portal-mvp/tasks.md`
- [ ] T040 [P] Confirm quickstart validation scenarios match implemented baseline in `specs/002-trends-portal-mvp/quickstart.md`
- [ ] T041 Confirm task board references do not claim future workflows are implemented in `docs/17-task-board.md`
- [ ] T042 Confirm implementation backlog keeps innovation, scoring, pilots, KPI, source review, and My Trends as future work in `docs/18-full-implementation-backlog.md`
- [ ] T043 Record that no application code changes were made during Spec Kit synchronization in `docs/test-evidence/002-trends-portal-mvp.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies.
- **Phase 2 Foundational**: Depends on Phase 1; supports all story validation.
- **US1-US4**: Can start after Phase 2 and may run in parallel because they validate separate implemented areas.
- **US5**: Can start after Phase 2 and may run in parallel with US1-US4.
- **Phase 8 Polish**: Depends on selected validation phases.

### User Story Dependencies

- **US1 Trend Radar**: Depends on Phase 2 only.
- **US2 Trend Mutation/Audit**: Depends on Phase 2 only.
- **US3 Seed Publication**: Depends on Phase 2 only.
- **US4 Reference Data Governance**: Depends on Phase 2 only.
- **US5 Shell And Placeholders**: Depends on Phase 2 only.

### Within Each User Story

- Contract/document evidence can be recorded before source behavior evidence.
- Source behavior evidence should reference existing code/tests, not implement new code.
- Evidence updates should be recorded in `docs/test-evidence/002-trends-portal-mvp.md`.

## Parallel Opportunities

- Setup checks T003-T005 can run in parallel.
- Foundational evidence tasks T007-T010 can run in parallel.
- US1 evidence tasks T012-T014 can run in parallel.
- US3 evidence tasks T022-T024 can run in parallel.
- US4 evidence tasks T028-T029 can run in parallel.
- US5 evidence tasks T033-T035 can run in parallel.
- Polish checks T038-T040 can run in parallel.

## Parallel Example: User Story 3

```text
Task: "T022 [P] [US3] Record seed source file coverage from data/seed/primary-technology-trends.seed.json and data/seed/strategic-initiatives.seed.json in docs/test-evidence/002-trends-portal-mvp.md"
Task: "T023 [P] [US3] Record generated seed load artifact coverage from data/seed/generated/portal-seed.load.json in docs/test-evidence/002-trends-portal-mvp.md"
Task: "T024 [P] [US3] Record seed loader/publisher behavior from apps/backend/src/modules/seed/seed-loader.ts and apps/backend/src/modules/seed/seed-publisher.ts in docs/test-evidence/002-trends-portal-mvp.md"
```

## Parallel Example: User Story 5

```text
Task: "T033 [P] [US5] Record route map coverage from apps/frontend/src/routes.ts in docs/test-evidence/002-trends-portal-mvp.md"
Task: "T034 [P] [US5] Record app route wiring from apps/frontend/src/App.tsx in docs/test-evidence/002-trends-portal-mvp.md"
Task: "T035 [P] [US5] Record shell layout and theme control behavior from apps/frontend/src/layout/AppLayout.tsx and apps/frontend/src/theme/theme-shell.ts in docs/test-evidence/002-trends-portal-mvp.md"
```

## Implementation Strategy

### Baseline First

1. Complete Phase 1 and Phase 2.
2. Validate US1-US4 as the implemented backend/data/UI baseline.
3. Validate US5 to keep placeholder routes honest.
4. Complete Phase 8 to confirm no future workflow implementation tasks remain.

### Incremental Delivery

1. Preserve current implemented behavior.
2. Add evidence for each implemented story without changing application code.
3. Keep future workflows out of this task list until their own spec/plan/tasks are created.

### Team Strategy

Multiple contributors can validate separate evidence areas in parallel because this task list is documentation/evidence oriented and does not require application code edits.

## Notes

- Tasks T001-T043 follow the required checkbox, task ID, optional `[P]`, optional story label, and file-path format.
- This task list intentionally avoids implementation tasks for innovation, scoring, pilots, KPI/value dashboards, source review, business cases, and employee My Trends.
- If future workflows are needed, create or update a separate Spec Kit slice instead of expanding this implemented-baseline task list.
