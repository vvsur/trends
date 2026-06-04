# Feature Specification: Corporate Trends Portal Implemented Baseline

**Feature Branch**: `002-trends-portal-mvp`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "Changes are already implemented and working. Do not change code and do not run implementation. Bring spec.md into alignment with what is already done."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View The Technology Trend Radar (Priority: P1)

A portal user opens the trend radar and sees the implemented IT/technology trend list with practical filters, clear loading/error/empty states, and links to trend detail cards.

**Why this priority**: The delivered baseline is centered on making the existing technology trend register visible and usable. This is the first working replacement for scattered lists and presentations.

**Independent Test**: Open the trend list, change filters for domain/status/owner/department, reset filters, open a trend detail page, and verify the trend information is visible.

**Acceptance Scenarios**:

1. **Given** trend records exist, **When** a user opens the trend radar, **Then** the list shows trend title, description, status, domain, maturity, recommendation, owner, and review date.
2. **Given** a user selects domain, status, owner, or department filters, **When** the list reloads, **Then** the result set reflects the selected filters and the filter state remains visible in the page address.
3. **Given** the list is loading, empty, or unavailable, **When** the user opens the page, **Then** the page shows a clear loading, empty, or error state rather than an unfinished screen.
4. **Given** a user selects a trend, **When** the detail page opens, **Then** it shows the trend description, domain, maturity, recommendation, owner, review date, source traceability area, and empty sections for linked innovations, pilots, and metrics.

---

### User Story 2 - Create And Correct Trend Cards With Auditability (Priority: P1)

An authorized trend owner or administrator can create and update IT/technology trend cards while the system validates required fields and records audit history for manual changes.

**Why this priority**: Manual input and manual correction are mandatory product rules. The implemented baseline already supports controlled trend creation and correction in the service layer.

**Independent Test**: Create a trend with all required fields, update a controlled field with a reason, and verify the change is accepted only for an authorized actor and recorded as an auditable manual change.

**Acceptance Scenarios**:

1. **Given** an authorized trend editor, **When** they create a trend with required fields, **Then** the trend is saved and the creation is recorded as a manual audit event.
2. **Given** an existing trend, **When** an authorized trend editor updates it with a non-empty reason, **Then** the trend version increases and the before/after change is recorded with actor, source, changed fields, and reason.
3. **Given** a trend update is submitted without a reason, **When** the system validates the change, **Then** the update is rejected because correction reasons are required.
4. **Given** a user without the trend-editing capability, **When** they try to create or update a trend, **Then** the operation is rejected.

---

### User Story 3 - Publish Traceable PDF Seed Data Into The Portal (Priority: P1)

A data owner publishes the existing PDF-derived seed data so the portal starts with strategic initiatives and primary technology trends that preserve source traceability.

**Why this priority**: The product must not start from an empty workspace. The implemented seed baseline publishes the documented starting data and keeps traceability attached to records.

**Independent Test**: Publish seed data, open the trend list and initiative list, and verify the expected seed counts and traceability fields are visible.

**Acceptance Scenarios**:

1. **Given** the seed data has been published, **When** a user opens the trend radar, **Then** primary technology trends from the source register are visible as trend records.
2. **Given** the seed data has been published, **When** a user opens the initiative register, **Then** the 7 strategic initiatives are listed with department, period, owner, comment, seed key, and source number display.
3. **Given** a seed record is displayed, **When** a user inspects the trend or initiative, **Then** the source traceability information remains attached to the record.
4. **Given** the source trend numbering omits item 9, **When** seed traceability is validated, **Then** the original numbering gap is preserved rather than renumbered.

---

### User Story 4 - Administer Reference Data With Governance (Priority: P1)

An administrator manages the implemented reference dictionaries for departments, trend domains, statuses, maturity rings, and recommendations without changing application code.

**Why this priority**: Reference data drives filtering, trend creation, staged domain enablement, and governance. The implemented baseline includes managed dictionary operations and audit events.

**Independent Test**: List a dictionary, create an item, update it with a reason, deactivate it with a reason, and verify the mutation requires an authorized administrator and creates audit history.

**Acceptance Scenarios**:

1. **Given** a user opens a supported dictionary, **When** the dictionary is requested, **Then** active and inactive items are returned in a stable order.
2. **Given** an authorized administrator creates a dictionary item, **When** required fields are valid, **Then** the item is created and audit history records the manual creation.
3. **Given** an authorized administrator updates or deactivates a dictionary item, **When** a non-empty reason is supplied, **Then** the change is saved and audit history records the correction.
4. **Given** a non-admin user attempts to mutate reference data, **When** the operation is checked, **Then** the operation is rejected.

---

### User Story 5 - Use The MVP Shell And Planned Module Placeholders (Priority: P2)

A portal user navigates the implemented application shell and sees the active sections plus clear placeholder surfaces for future modules that are not yet implemented as business workflows.

**Why this priority**: The delivered UI establishes navigation, themes, and expectations for future modules while avoiding a false claim that innovation, scoring, pilots, KPI, cases, and My Trends workflows are complete.

**Independent Test**: Navigate through the portal shell, switch theme modes, open the active trend and initiative sections, and open planned module pages to verify they are marked as skeleton/next-step surfaces.

**Acceptance Scenarios**:

1. **Given** a user opens the portal, **When** the shell loads, **Then** navigation shows trend radar, initiative register, scoring, pilots, KPI, cases, and My Trends entries.
2. **Given** a user opens a future module route that is not yet implemented, **When** the page renders, **Then** it shows a skeleton module summary rather than a completed workflow.
3. **Given** a user changes the visual theme mode, **When** they continue navigating, **Then** the application shell remains usable in the supported theme states.
4. **Given** a user opens the initiative navigation item, **When** the page loads, **Then** they see the implemented strategic initiative list rather than a generic placeholder.

### Edge Cases

- If a trend list or detail request fails, the UI shows an error state with enough context for the user to understand that the data is unavailable.
- If no trends match selected filters, the trend list shows an empty state and allows filters to be reset.
- If a trend detail route is opened without a valid trend identifier or for a missing trend, the user sees a not-available state.
- If a reference data mutation or trend correction is submitted without a required reason, the system rejects the change.
- If a trend references an inactive or unknown domain, status, maturity ring, recommendation, or owner during mutation, the system rejects the change.
- If seed data is published repeatedly, publication remains safe to rerun and does not create duplicate business records.
- If future-module navigation is used before the corresponding workflow is implemented, the page remains a clearly bounded skeleton surface.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a working portal shell with navigation for the implemented trend radar and initiative register, plus clearly bounded placeholders for future modules.
- **FR-002**: The system MUST support light, dark, and inverted theme states in the portal shell.
- **FR-003**: The system MUST list trend records with title, description, status, domain, maturity, recommendation, owner, and review date.
- **FR-004**: Users MUST be able to filter trend records by domain, status, owner, and department.
- **FR-005**: Users MUST be able to open a trend detail page showing the trend description, domain, maturity, recommendation, owner, review date, source traceability area, and empty linked sections for innovations, pilots, and metrics.
- **FR-006**: Authorized trend editors MUST be able to create trend records with title, description, domain, maturity, recommendation, owner, review date, status, horizon, optional secondary domains, optional relevance score, and optional source traceability.
- **FR-007**: Authorized trend editors MUST be able to update trend records only when they provide a non-empty correction reason.
- **FR-008**: Trend creation and trend correction MUST create audit history with actor, source, changed fields, entity version, and before/after values where applicable.
- **FR-009**: Trend mutations MUST validate that referenced domain, maturity, recommendation, status, and owner records exist and are active.
- **FR-010**: Trend relevance score, when supplied, MUST be an integer from 0 to 100.
- **FR-011**: The system MUST publish the documented PDF-derived seed data for primary technology trends and strategic initiatives.
- **FR-012**: Seed publication MUST preserve source traceability metadata for seed-created trend and strategic initiative records.
- **FR-013**: Seed publication MUST preserve the source numbering gap where the primary technology trend list has no item 9.
- **FR-014**: The system MUST list strategic initiatives with title, department, creation quarter, owner, year, comment, seed key, source traceability, and version information.
- **FR-015**: Administrators MUST be able to list, create, update, and deactivate supported reference data dictionaries.
- **FR-016**: Reference data update and deactivation MUST require a non-empty reason and create audit history.
- **FR-017**: Reference data mutation MUST be limited to authorized administrators.
- **FR-018**: The system MUST resolve the current acting user from the local MVP actor context for protected mutations.
- **FR-019**: Role-based access MUST distinguish at least employee, trend owner, expert, executive, and administrator responsibilities.
- **FR-020**: The audit layer MUST reject correction, status change, decision, delete, and admin override audit events that do not include a non-empty reason.
- **FR-021**: The system MUST return a consistent user-facing error shape for validation, authentication, authorization, not found, conflict, and internal errors.
- **FR-022**: Trend list, trend detail, and initiative list pages MUST provide loading, empty, and error states.
- **FR-023**: Future modules for innovation registry, scoring, pilots, KPI, cases, and My Trends MUST be represented only as skeleton/navigation surfaces until their workflows are implemented.

### Key Entities *(include if feature involves data)*

- **User**: A local MVP portal participant with display name, email, status, optional department, and version.
- **Employee Profile**: Personalization metadata for a user, including primary role, department, skills, interests, subscribed domains, and contribution score placeholder.
- **Role Assignment**: A user's active or inactive role with optional scope for access decisions.
- **Department**: Managed organizational reference data used for users, strategic initiatives, filters, and reporting foundations.
- **Trend Domain**: Managed trend-domain reference data; the technology domain is active for the implemented baseline and future domains can remain inactive or hidden.
- **Trend Status**: Managed status reference data for trend lifecycle values.
- **Innovation Status**: Managed reference data prepared for the future innovation pipeline, without an implemented innovation workflow in this baseline.
- **Pilot Status**: Managed reference data prepared for the future pilot workflow, without an implemented pilot workflow in this baseline.
- **Maturity Ring**: Managed reference data describing trend maturity or lifecycle position.
- **Trend Recommendation**: Managed reference data describing the recommendation associated with a trend.
- **Trend**: A technology trend card with ownership, domain, status, maturity, recommendation, review date, horizon, relevance score, source traceability, version, and timestamps.
- **Strategic Initiative**: A PDF-derived starting initiative with department, quarter, owner name, year, comment, seed key, source traceability, version, and timestamps.
- **Audit Event**: A record of controlled creation, correction, status, review, publication, import, seed, decision, delete, or admin override activity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can open the trend radar and see the seeded technology trend list after data publication.
- **SC-002**: A user can apply and reset all implemented trend filters: domain, status, owner, and department.
- **SC-003**: A user can open a trend detail page from the trend list and see the required trend fields and source traceability area.
- **SC-004**: An authorized trend editor can create a valid trend record, and the resulting record appears in subsequent trend list or detail views.
- **SC-005**: 100% of trend corrections require a non-empty reason and create audit history with before/after values.
- **SC-006**: Seed publication results in 7 strategic initiatives being available in the initiative register.
- **SC-007**: Seed publication makes the documented primary technology trends available as trend records with source traceability.
- **SC-008**: Source traceability preserves the missing source number 9 as a source fact rather than renumbering the seed trend list.
- **SC-009**: 100% of reference data updates and deactivations require a non-empty reason and create audit history.
- **SC-010**: Unauthorized users cannot create or update trends or mutate reference data.
- **SC-011**: Trend list, trend detail, and initiative list pages each expose clear loading and error states.
- **SC-012**: Future-module routes render as bounded skeleton surfaces and do not present unimplemented workflows as complete.

## Assumptions

- This specification describes the implementation baseline that already exists; it does not request new code or implementation work.
- Innovation registry, scoring workflow, pilot workflow, KPI dashboards, business cases, source registry, external signal review, and employee "My Trends" workflows are future work unless explicitly implemented later.
- The initiative navigation label may use the broader product term "registry", but the implemented page currently lists PDF-derived strategic initiatives.
- Manual correction is implemented for trend and reference data mutations; strategic initiative correction is not part of the implemented baseline described here.
- Source traceability is implemented as attached structured metadata for seed-created trends and strategic initiatives.
- The final corporate scoring regulation remains unpublished and is not implemented in this baseline.
