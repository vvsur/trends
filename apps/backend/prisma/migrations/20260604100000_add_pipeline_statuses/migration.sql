-- Create trend status dictionary.
CREATE TABLE "trend_statuses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- Create innovation pipeline status dictionary.
CREATE TABLE "innovation_statuses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- Create pilot status dictionary.
CREATE TABLE "pilot_statuses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "trend_statuses_code_key" ON "trend_statuses"("code");
CREATE UNIQUE INDEX "innovation_statuses_code_key" ON "innovation_statuses"("code");
CREATE UNIQUE INDEX "pilot_statuses_code_key" ON "pilot_statuses"("code");

-- Seed status dictionaries from the MVP backlog pipeline.
INSERT INTO "trend_statuses" (
    "id",
    "code",
    "name",
    "description",
    "active",
    "sort_order",
    "updated_at"
) VALUES
    ('trend-status-draft', 'draft', 'Черновик', 'Тренд создан вручную или импортирован, но еще не готов к публикации.', true, 10, CURRENT_TIMESTAMP),
    ('trend-status-review', 'in_review', 'На проверке', 'Тренд ожидает экспертной проверки или ручного подтверждения.', true, 20, CURRENT_TIMESTAMP),
    ('trend-status-published', 'published', 'Опубликован', 'Тренд подтвержден и доступен в рабочем реестре и фильтрах.', true, 30, CURRENT_TIMESTAMP),
    ('trend-status-archived', 'archived', 'Архив', 'Тренд сохранен для истории, но не участвует в актуальном pipeline.', true, 40, CURRENT_TIMESTAMP);

INSERT INTO "innovation_statuses" (
    "id",
    "code",
    "name",
    "description",
    "active",
    "sort_order",
    "updated_at"
) VALUES
    ('innovation-status-proposed', 'proposed', 'Предложено', 'Идея или инновация предложена сотрудником или владельцем процесса.', true, 10, CURRENT_TIMESTAMP),
    ('innovation-status-under-assessment', 'under_assessment', 'На оценке', 'Инновация находится на экспертной оценке перед скорингом.', true, 20, CURRENT_TIMESTAMP),
    ('innovation-status-scored', 'scored', 'Прошел скоринг', 'По инновации завершен быстрый скоринг.', true, 30, CURRENT_TIMESTAMP),
    ('innovation-status-pilot', 'pilot', 'Пилот', 'Инновация переведена в пилот или связана с активной гипотезой пилота.', true, 40, CURRENT_TIMESTAMP),
    ('innovation-status-effect-measurement', 'effect_measurement', 'Эффект измеряется', 'Пилот или внедрение завершены, идет замер эффекта.', true, 50, CURRENT_TIMESTAMP),
    ('innovation-status-implemented', 'implemented', 'Внедрено', 'Инновация внедрена или масштабирована.', true, 60, CURRENT_TIMESTAMP),
    ('innovation-status-stopped', 'stopped', 'Остановлено', 'Работа остановлена с фиксируемой причиной.', true, 70, CURRENT_TIMESTAMP),
    ('innovation-status-deferred', 'deferred', 'Отложено', 'Работа отложена до решения, ресурсов или нового review.', true, 80, CURRENT_TIMESTAMP);

INSERT INTO "pilot_statuses" (
    "id",
    "code",
    "name",
    "description",
    "active",
    "sort_order",
    "updated_at"
) VALUES
    ('pilot-status-planned', 'planned', 'Запланирован', 'Пилот создан, критерии и даты готовятся или согласуются.', true, 10, CURRENT_TIMESTAMP),
    ('pilot-status-active', 'active', 'Активен', 'Пилот выполняется в согласованном скоупе.', true, 20, CURRENT_TIMESTAMP),
    ('pilot-status-blocked', 'blocked', 'Заблокирован', 'Пилот не может двигаться без снятия блокера.', true, 30, CURRENT_TIMESTAMP),
    ('pilot-status-overdue', 'overdue', 'Просрочен', 'Пилот превысил целевую дату завершения или next action.', true, 40, CURRENT_TIMESTAMP),
    ('pilot-status-completed', 'completed', 'Завершен', 'Пилот завершен и ожидает итогового решения или уже имеет результат.', true, 50, CURRENT_TIMESTAMP),
    ('pilot-status-stopped', 'stopped', 'Остановлен', 'Пилот остановлен с фиксируемой причиной.', true, 60, CURRENT_TIMESTAMP),
    ('pilot-status-deferred', 'deferred', 'Отложен', 'Пилот отложен до решения, ресурсов или нового review.', true, 70, CURRENT_TIMESTAMP);
