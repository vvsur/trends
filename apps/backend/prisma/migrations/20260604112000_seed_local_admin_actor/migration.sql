-- Seed local MVP admin actor for protected API development and tests.
INSERT INTO "users" (
    "id",
    "display_name",
    "email",
    "status",
    "department_id",
    "version",
    "updated_at"
) VALUES (
    'user-local-admin',
    'Local Admin',
    'admin@trends.local',
    'active',
    'department-itg',
    1,
    CURRENT_TIMESTAMP
);

INSERT INTO "role_assignments" (
    "id",
    "user_id",
    "role",
    "scope_type",
    "scope_id",
    "active",
    "reason",
    "version",
    "updated_at"
) VALUES (
    'role-local-admin-global',
    'user-local-admin',
    'admin',
    'global',
    NULL,
    true,
    'Seeded local MVP admin actor for protected API development.',
    1,
    CURRENT_TIMESTAMP
);
