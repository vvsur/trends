# Research: Corporate Trends Portal Implemented Baseline

## Decision: Synchronize Planning To Existing Code, Not Future MVP Intent

**Rationale**: The user explicitly stated that changes are already implemented and working, and asked not to change code or run implementation. The plan must therefore describe the delivered baseline rather than the broader future MVP concept.

**Alternatives considered**:

- Keep broad MVP plan with innovation/scoring/pilot/KPI tasks: rejected because it conflicts with the implemented code surface.
- Generate a new feature directory: rejected because the current branch/spec directory already represents this work.

## Decision: Treat Trend Radar And Seed Publication As Delivered Business Slice

**Rationale**: Existing code includes trend list/detail frontend pages, trend backend list/get/create/update behavior, source traceability fields, seed publisher/loader, strategic initiative listing, and seed files. These are the concrete implemented user value.

**Alternatives considered**:

- Treat trend creation as future because no frontend edit form exists: rejected because backend behavior and audit are implemented; the spec can distinguish backend mutation support from currently visible UI list/detail.
- Treat strategic initiatives as full innovation registry: rejected because the implemented page lists PDF-derived strategic initiatives, not a full innovation pipeline.

## Decision: Keep Reference Data, RBAC, Current Actor, And Audit As Delivered Foundations

**Rationale**: Existing modules support managed reference data with admin-only mutation, current actor resolution, scoped role capabilities, and reason-required audit events. These are working foundations and should be represented in plan/data/contracts.

**Alternatives considered**:

- Hide foundation capabilities because they are not all visible in UI: rejected because they are implemented backend behavior and required for trend/reference governance.
- Present RBAC as production identity integration: rejected because the implemented actor context is a local MVP shim.

## Decision: Mark Future Modules As Skeleton/Placeholder Surfaces

**Rationale**: The frontend navigation includes scoring, pilots, KPI, cases, and My Trends entries, but those routes render generic module placeholders. Planning must avoid claiming completed workflows where only navigation/shell exists.

**Alternatives considered**:

- Remove future modules from planning artifacts: rejected because navigation exists and should be documented honestly.
- Keep full contracts for future workflows: rejected because they do not match the implemented OpenAPI contract or backend modules.

## Decision: Keep Final Scoring Regulation Out Of Delivered Scope

**Rationale**: The source documents say final scoring regulation will be published later, and no scoring workflow is implemented in code. The delivered baseline only has placeholder navigation and reference foundations.

**Alternatives considered**:

- Describe draft scoring as implemented: rejected because there is no scoring module/service/route/page beyond generic placeholder navigation.

## Decision: Validate With Documentation And Existing Project Checks, But Do Not Run Implementation

**Rationale**: This synchronization turn is documentation-only. Quickstart can list the checks that prove the implemented baseline, but this command does not run application tests or mutate code.

**Alternatives considered**:

- Run full validation now: rejected because the user explicitly asked to synchronize the plan without implementation work.
