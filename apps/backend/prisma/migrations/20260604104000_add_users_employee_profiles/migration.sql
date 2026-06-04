-- Create users for local MVP identity and ownership.
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "display_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "department_id" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "users_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create scoped role assignments from ADR 0005.
CREATE TABLE "role_assignments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "scope_type" TEXT,
    "scope_id" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "reason" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "role_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create employee-facing profile data for My Trends relevance.
CREATE TABLE "employee_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "primary_role" TEXT NOT NULL DEFAULT 'employee',
    "department_id" TEXT NOT NULL,
    "skills_json" TEXT NOT NULL DEFAULT '[]',
    "interests_json" TEXT NOT NULL DEFAULT '[]',
    "subscribed_domains_json" TEXT NOT NULL DEFAULT '[]',
    "contribution_score" REAL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "employee_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "employee_profiles_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_department_id_idx" ON "users"("department_id");

CREATE INDEX "role_assignments_user_id_idx" ON "role_assignments"("user_id");
CREATE INDEX "role_assignments_role_active_idx" ON "role_assignments"("role", "active");

CREATE UNIQUE INDEX "employee_profiles_user_id_key" ON "employee_profiles"("user_id");
CREATE INDEX "employee_profiles_department_id_idx" ON "employee_profiles"("department_id");
