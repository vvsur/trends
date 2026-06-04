-- CreateTable
CREATE TABLE "trend_domains" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "visible_in_mvp" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "trend_domains_code_key" ON "trend_domains"("code");

-- Seed static MVP domain dictionary.
INSERT INTO "trend_domains" (
    "id",
    "code",
    "name",
    "description",
    "active",
    "visible_in_mvp",
    "sort_order",
    "updated_at"
) VALUES
    ('domain-technology', 'technology', 'Технологии', 'AI, платформенная инженерия, API, кибербезопасность, данные, облака, инфраструктура и разработка ПО.', true, true, 10, CURRENT_TIMESTAMP),
    ('domain-exchange-finance', 'exchange_finance', 'Биржевые и финансовые рынки', 'Рыночная инфраструктура, клиринг, расчеты, токенизация, цифровые активы, CBDC, open finance, market data, regtech/suptech.', false, false, 20, CURRENT_TIMESTAMP),
    ('domain-product-client', 'product_client', 'Клиенты и продукты', 'Потребности участников рынка, UX личных кабинетов, data-продукты, self-service, API-продукты.', false, false, 30, CURRENT_TIMESTAMP),
    ('domain-regulatory', 'regulatory', 'Регуляторика и compliance', 'Законодательные инициативы, требования регуляторов, стандарты раскрытия, санкционный и операционный риск.', false, false, 40, CURRENT_TIMESTAMP),
    ('domain-hr', 'hr', 'HR и организация', 'Навыки будущего, AI в рабочих процессах, гибридная работа, обучение, мотивация и оргдизайн.', false, false, 50, CURRENT_TIMESTAMP),
    ('domain-resilience', 'resilience', 'Операционная устойчивость', 'BCP/DR, киберустойчивость, supply chain, инфраструктурные риски и импортозамещение.', false, false, 60, CURRENT_TIMESTAMP),
    ('domain-macro-industry', 'macro_industry', 'Макроэкономика и отрасль', 'Геоэкономика, ликвидность, инвестиционные потоки, конкуренты, экосистемы и стратегические сценарии.', false, false, 70, CURRENT_TIMESTAMP),
    ('domain-esg', 'esg', 'ESG и устойчивое развитие', 'Климатические требования, green finance, социальные и governance-практики.', false, false, 80, CURRENT_TIMESTAMP);
