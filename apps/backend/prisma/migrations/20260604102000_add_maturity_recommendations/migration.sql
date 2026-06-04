-- Create trend maturity/radar ring dictionary.
CREATE TABLE "maturity_rings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- Create trend recommendation dictionary.
CREATE TABLE "trend_recommendations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "maturity_rings_code_key" ON "maturity_rings"("code");
CREATE UNIQUE INDEX "trend_recommendations_code_key" ON "trend_recommendations"("code");

-- Seed maturity rings from the technology radar model and architecture refresh notes.
INSERT INTO "maturity_rings" (
    "id",
    "code",
    "name",
    "description",
    "active",
    "sort_order",
    "updated_at"
) VALUES
    ('maturity-ring-adopt', 'adopt', 'Внедрять', 'Тренд достаточно зрелый для внедрения в подходящем бизнес-контексте.', true, 10, CURRENT_TIMESTAMP),
    ('maturity-ring-trial', 'trial', 'Пилотировать', 'Тренд готов к ограниченной проверке через гипотезу или пилот.', true, 20, CURRENT_TIMESTAMP),
    ('maturity-ring-assess', 'assess', 'Изучать', 'Тренд требует экспертной оценки, уточнения ценности и ограничений.', true, 30, CURRENT_TIMESTAMP),
    ('maturity-ring-watch', 'watch', 'Наблюдать', 'Тренд важен для мониторинга, но пока не требует активного пилота.', true, 40, CURRENT_TIMESTAMP),
    ('maturity-ring-hold', 'hold', 'Пауза', 'Тренд не рекомендован к активному продвижению до нового review или изменения условий.', true, 50, CURRENT_TIMESTAMP);

-- Seed recommendation values from TR-303 and scoring/trend backlog language.
INSERT INTO "trend_recommendations" (
    "id",
    "code",
    "name",
    "description",
    "active",
    "sort_order",
    "updated_at"
) VALUES
    ('trend-recommendation-watch', 'watch', 'Наблюдать', 'Следить за сигналами и возвращаться к review по расписанию.', true, 10, CURRENT_TIMESTAMP),
    ('trend-recommendation-assess', 'assess', 'Оценить', 'Провести экспертную оценку, собрать ограничения и potential impact.', true, 20, CURRENT_TIMESTAMP),
    ('trend-recommendation-pilot', 'pilot', 'Пилотировать', 'Сформировать гипотезу и запустить ограниченный пилот.', true, 30, CURRENT_TIMESTAMP),
    ('trend-recommendation-scale', 'scale', 'Масштабировать', 'Расширить успешный пилот или внедрение на больший scope.', true, 40, CURRENT_TIMESTAMP),
    ('trend-recommendation-hold', 'hold', 'Пауза', 'Отложить активные действия до нового решения, ресурсов или изменения условий.', true, 50, CURRENT_TIMESTAMP);
