-- Create append-only audit event table from ADR 0006.
CREATE TABLE "audit_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "event_type" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "entity_version_before" INTEGER,
    "entity_version_after" INTEGER,
    "actor_id" TEXT NOT NULL,
    "actor_type" TEXT NOT NULL,
    "actor_role" TEXT,
    "actor_scope_json" TEXT,
    "source" TEXT NOT NULL,
    "reason" TEXT,
    "before_json" TEXT,
    "after_json" TEXT,
    "changed_fields_json" TEXT,
    "correlation_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "audit_events_entity_type_entity_id_created_at_idx" ON "audit_events"("entity_type", "entity_id", "created_at");
CREATE INDEX "audit_events_actor_id_created_at_idx" ON "audit_events"("actor_id", "created_at");
