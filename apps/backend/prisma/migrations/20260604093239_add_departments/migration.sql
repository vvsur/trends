-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_code_key" ON "departments"("code");

-- Seed static departments from the PDF source traceability contract.
INSERT INTO "departments" (
    "id",
    "code",
    "name",
    "description",
    "active",
    "sort_order",
    "updated_at"
) VALUES
    ('department-itg', 'ITG', 'ITG', 'Определение инноваций и трендов, система скоринга и стратегические инициативы из PDF seed.', true, 10, CURRENT_TIMESTAMP),
    ('department-kss', 'КСС', 'КСС', 'Операционная деятельность, итоги и первичный набор технологических трендов из PDF seed.', true, 20, CURRENT_TIMESTAMP),
    ('department-tkc', 'TKC', 'TKC', 'Перспективная технологическая платформа "Рапид" из PDF seed.', true, 30, CURRENT_TIMESTAMP);
