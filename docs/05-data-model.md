# Черновая модель данных

## Trend

| Поле | Тип | Обязательное |
| --- | --- | --- |
| id | UUID | да |
| title | string | да |
| description | text | да |
| domain | enum/ref | да |
| maturity_ring | enum | да |
| recommendation | enum | да |
| owner_id | user ref | да |
| review_date | date | да |
| status | enum | да |
| created_at / updated_at | timestamp | да |

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

