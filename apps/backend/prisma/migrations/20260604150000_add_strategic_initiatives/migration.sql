-- Create strategic initiatives imported from the source PDF seed.
CREATE TABLE "strategic_initiatives" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seed_key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "created_quarter" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "source_trace_json" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "strategic_initiatives_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "strategic_initiatives_seed_key_key" ON "strategic_initiatives"("seed_key");
CREATE INDEX "strategic_initiatives_department_id_idx" ON "strategic_initiatives"("department_id");
