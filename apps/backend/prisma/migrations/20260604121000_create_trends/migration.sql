-- Create trend card table for MVP technology trend CRUD.
CREATE TABLE "trends" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "domain_id" TEXT NOT NULL,
    "secondary_domains_json" TEXT NOT NULL DEFAULT '[]',
    "maturity_ring_id" TEXT NOT NULL,
    "recommendation_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "review_date" DATETIME NOT NULL,
    "status_id" TEXT NOT NULL,
    "horizon" TEXT NOT NULL,
    "relevance_score" INTEGER,
    "source_trace_json" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "trends_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "trend_domains" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "trends_maturity_ring_id_fkey" FOREIGN KEY ("maturity_ring_id") REFERENCES "maturity_rings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "trends_recommendation_id_fkey" FOREIGN KEY ("recommendation_id") REFERENCES "trend_recommendations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "trends_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "trends_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "trend_statuses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "trends_domain_id_idx" ON "trends"("domain_id");
CREATE INDEX "trends_owner_id_idx" ON "trends"("owner_id");
CREATE INDEX "trends_status_id_idx" ON "trends"("status_id");
CREATE INDEX "trends_review_date_idx" ON "trends"("review_date");
