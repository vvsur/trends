# Черновая модель данных

## Trend

| Поле | Тип | Обязательное |
| --- | --- | --- |
| id | UUID | да |
| title | string | да |
| description | text | да |
| domain | enum/ref | да |
| secondary_domains | enum/ref[] | нет |
| maturity_ring | enum | да |
| recommendation | enum | да |
| owner_id | user ref | да |
| review_date | date | да |
| status | enum | да |
| horizon | enum | да |
| relevance_score | int 0-100 | нет |
| created_at / updated_at | timestamp | да |

Допустимые домены первого уровня:

- `technology`
- `exchange_finance`
- `product_client`
- `regulatory`
- `hr`
- `resilience`
- `macro_industry`
- `esg`

## Innovation

| Поле | Тип | Обязательное |
| --- | --- | --- |
| id | UUID | да |
| title | string | да |
| description | text | да |
| trend_id | ref | да |
| department_id | ref | да |
| owner_id | user ref | да |
| author_id | user ref | да |
| year | int | да |
| quarter | enum | да |
| pipeline_status | enum | да |
| expected_effect | text | нет |
| comment | text | нет |

## Scoring

| Поле | Тип | Обязательное |
| --- | --- | --- |
| id | UUID | да |
| innovation_id | ref | да |
| evaluator_id | user ref | да |
| impact | int 1-5 | да |
| confidence | int 1-5 | да |
| ease | int 1-5 | да |
| security_fit | int 1-5 | да |
| architecture_fit | int 1-5 | да |
| data_availability | int 1-5 | да |
| total_score | decimal | да |
| recommendation | enum | да |
| comment | text | нет |
| created_at | timestamp | да |

## Pilot

| Поле | Тип | Обязательное |
| --- | --- | --- |
| id | UUID | да |
| innovation_id | ref | да |
| title | string | да |
| owner_id | user ref | да |
| status | enum | да |
| start_date | date | да |
| target_end_date | date | да |
| actual_end_date | date | нет |
| success_criteria | text | да |
| baseline | text/metric | нет |
| target | text/metric | да |
| result | text | нет |
| decision | enum | нет |

## Decision

| Поле | Тип | Обязательное |
| --- | --- | --- |
| id | UUID | да |
| entity_type | enum | да |
| entity_id | UUID | да |
| decision | enum | да |
| decided_by | user ref | да |
| decision_date | date | да |
| rationale | text | да |
| next_review_date | date | нет |

## BusinessCase

| Поле | Тип | Обязательное |
| --- | --- | --- |
| id | UUID | да |
| pilot_id | ref | да |
| title | string | да |
| problem | text | да |
| solution | text | да |
| effect | text | да |
| constraints | text | нет |
| reusable_for | text | нет |
| contacts | user refs | да |

## Source

| Поле | Тип | Обязательное |
| --- | --- | --- |
| id | UUID | да |
| name | string | да |
| url | string | да |
| source_type | enum | да |
| domains | enum[] | да |
| trust_level | enum high/medium/low | да |
| collection_frequency | enum | да |
| owner_id | user ref | да |
| active | boolean | да |

## ExternalSignal

| Поле | Тип | Обязательное |
| --- | --- | --- |
| id | UUID | да |
| external_id | string | да |
| source_id | ref | да |
| import_batch_id | ref | да |
| domain | enum | да |
| title | string | да |
| summary | text | да |
| url | string | да |
| published_at | date | нет |
| captured_at | timestamp | да |
| language | string | да |
| tags | string[] | нет |
| confidence | decimal | да |
| hash | string | да |
| review_status | enum | да |
| reviewed_by | user ref | нет |
| linked_trend_id | ref | нет |

## ImportBatch

| Поле | Тип | Обязательное |
| --- | --- | --- |
| id | UUID | да |
| batch_id | string | да |
| generated_at | timestamp | да |
| imported_at | timestamp | да |
| source_registry_version | string | да |
| classification | enum | да |
| file_hash | string | да |
| signature | string | да |
| validation_status | enum | да |
| validation_errors | json | нет |

## EmployeeProfile

| Поле | Тип | Обязательное |
| --- | --- | --- |
| user_id | user ref | да |
| role | string/ref | да |
| department_id | ref | да |
| skills | string[] | нет |
| interests | string[] | нет |
| subscribed_domains | enum[] | нет |
| contribution_score | decimal | нет |

## Contribution

| Поле | Тип | Обязательное |
| --- | --- | --- |
| id | UUID | да |
| user_id | user ref | да |
| entity_type | enum idea/review/pilot/case/comment | да |
| entity_id | UUID | да |
| contribution_type | enum | да |
| business_impact | text | нет |
| recognized | boolean | да |
| created_at | timestamp | да |

## ValueMetric

| Поле | Тип | Обязательное |
| --- | --- | --- |
| id | UUID | да |
| entity_type | enum trend/innovation/pilot/business_case | да |
| entity_id | UUID | да |
| metric_group | enum revenue/efficiency/risk/market_position/employee_value/process_health | да |
| metric_name | string | да |
| baseline | decimal/text | нет |
| target | decimal/text | нет |
| actual | decimal/text | нет |
| confidence | decimal | нет |
| calculation_note | text | нет |
| owner_id | user ref | да |
