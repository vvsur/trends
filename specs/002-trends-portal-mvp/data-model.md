# Data Model: Corporate Trends Portal Implemented Baseline

## Overview

This data model reflects the entities already present in the implemented baseline. It intentionally excludes full Innovation, Hypothesis, Scoring, Pilot, Metric, Decision, BusinessCase, Source, and Signal business entities because those workflows are not implemented in the current code. Innovation and pilot statuses exist only as managed reference data foundations.

## Implemented Entities

### User

**Purpose**: Local MVP actor and owner record for protected mutations and trend ownership.

**Key Fields**: id, display name, email, status, optional department, version, created/updated timestamps.

**Relationships**: May belong to Department; has RoleAssignments; may have EmployeeProfile; may own Trends.

**Validation Rules**: Email is unique. Trend owner references must point to an active user.

### EmployeeProfile

**Purpose**: Implemented personalization foundation for future employee-value workflows.

**Key Fields**: id, user, primary role, department, skills JSON, interests JSON, subscribed domains JSON, optional contribution score, version, timestamps.

**Relationships**: Belongs to User and Department.

**Validation Rules**: Each user has at most one employee profile.

### RoleAssignment

**Purpose**: Scope-aware role assignment used by current actor and RBAC checks.

**Key Fields**: id, user, role, optional scope type, optional scope id, active flag, optional reason, version, timestamps.

**Relationships**: Belongs to User.

**Validation Rules**: Only active assignments grant capabilities. Supported roles are employee, trend owner, expert, executive, and administrator.

### Department

**Purpose**: Managed organizational reference data for users, filters, seed records, and future reporting.

**Key Fields**: id, code, name, description, active flag, sort order, timestamps.

**Relationships**: Has Users, EmployeeProfiles, and StrategicInitiatives.

**Validation Rules**: Code is unique. Mutations through reference-data management are audited.

### TrendDomain

**Purpose**: Managed domain reference data for trend records and staged domain enablement.

**Key Fields**: id, code, name, description, active flag, visible-in-MVP flag, sort order, timestamps.

**Relationships**: Has Trends.

**Validation Rules**: A trend can reference only an active domain. Technology is the active implemented domain; future domains may remain inactive/hidden.

### TrendStatus

**Purpose**: Managed lifecycle/status reference data for trend records.

**Key Fields**: id, code, name, description, active flag, sort order, timestamps.

**Relationships**: Has Trends.

**Validation Rules**: A trend can reference only an active trend status.

### InnovationStatus

**Purpose**: Managed status reference data prepared for the future innovation pipeline.

**Key Fields**: id, code, name, description, active flag, sort order, timestamps.

**Relationships**: No implemented Innovation entity in this baseline.

**Validation Rules**: Managed as reference data only.

### PilotStatus

**Purpose**: Managed status reference data prepared for the future pilot workflow.

**Key Fields**: id, code, name, description, active flag, sort order, timestamps.

**Relationships**: No implemented Pilot entity in this baseline.

**Validation Rules**: Managed as reference data only.

### MaturityRing

**Purpose**: Managed maturity/lifecycle position reference data for trends.

**Key Fields**: id, code, name, description, active flag, sort order, timestamps.

**Relationships**: Has Trends.

**Validation Rules**: A trend can reference only an active maturity ring.

### TrendRecommendation

**Purpose**: Managed recommendation reference data for trends.

**Key Fields**: id, code, name, description, active flag, sort order, timestamps.

**Relationships**: Has Trends.

**Validation Rules**: A trend can reference only an active recommendation.

### Trend

**Purpose**: Implemented technology trend card.

**Key Fields**: id, title, description, primary domain, secondary domain codes JSON, maturity ring, recommendation, owner, review date, status, horizon, optional relevance score, optional source trace JSON, version, timestamps.

**Relationships**: Belongs to TrendDomain, MaturityRing, TrendRecommendation, User owner, and TrendStatus.

**Validation Rules**: Title, description, domain, maturity, recommendation, owner, review date, status, and horizon are required for creation. Relevance score must be an integer from 0 to 100 when supplied. Updates require a non-empty correction reason and increment version.

### StrategicInitiative

**Purpose**: PDF-derived starting strategic initiative displayed in the implemented initiative register.

**Key Fields**: id, seed key, title, department, created quarter, owner name, year, comment, source trace JSON, version, timestamps.

**Relationships**: Belongs to Department.

**Validation Rules**: Seed publication preserves exactly 7 strategic initiative records from the source contract.

### AuditEvent

**Purpose**: Append-only record for controlled changes.

**Key Fields**: id, event type, entity type, entity id, before/after versions, actor id/type/role/scope, source, optional reason, before/after JSON, changed fields JSON, correlation id, timestamp.

**Relationships**: References actors and controlled entities by id/type rather than hard foreign keys.

**Validation Rules**: Reason is mandatory for correction, status change, decision, delete, and admin override audit events. Trend create/update and reference-data create/update/deactivate write audit events in the same mutation flow.

## Implemented State Rules

### Trend Correction

Trend update requires a non-empty reason, validates active reference data and owner, increments trend version, and records before/after audit snapshots.

### Reference Data Governance

Supported dictionaries can be listed by any caller. Create/update/deactivate require an authenticated actor with reference-data management capability. Update and deactivate require a reason and write audit history.

### Seed Publication

Seed publication creates or updates PDF-derived trends and strategic initiatives while preserving source trace JSON. The primary technology trend source-number gap at item 9 remains a traceability fact.

## Explicitly Not Implemented In This Baseline

- Full Innovation entity and innovation registry workflow.
- Hypothesis workflow.
- Scoring workflow or scoring versions.
- Pilot entity and pilot workflow.
- KPI/value metric aggregation.
- Management decisions workflow.
- Business case library workflow.
- Source registry and signal review workflow.
- Employee My Trends, My Ideas, and contribution workflows.
