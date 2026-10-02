# DATA_MODEL_SPEC.md

## Fact Tables

### `fct_workflow_funnel_step`

Persistent DuckDB table for validated CSV rows.

Recommended columns:

| Column | DuckDB type | Required |
| --- | --- | --- |
| `organization_id` | `VARCHAR` | yes |
| `period_month` | `DATE` or validated month representation | yes |
| `workflow_name` | `VARCHAR` | yes |
| `step_order` | `INTEGER` | yes |
| `step_name` | `VARCHAR` | yes |
| `started_count` | `BIGINT` | yes |
| `completed_count` | `BIGINT` | yes |

Natural uniqueness key: `organization_id + period_month + workflow_name + step_order`.

## Dimension Tables

No separate physical dimension table is required for the 120-minute MVP. `organization_id`, `period_month`, `workflow_name`, `step_order`, and `step_name` act as analytical dimensions directly from the fact table.

If the implementation later introduces physical dimensions, this document must be revised before metric SQL is changed.

## Relationships

The MVP has one canonical fact table and no required foreign-key relationships.

Logical relationship inside the fact table:

- each `workflow_name` has an ordered set of `step_order`
- for the supplied dataset, `step_name` is stable for each `workflow_name + step_order`

## Grain Definitions

Canonical source and fact grain:

`organization_id + period_month + workflow_name + step_order`

Each row represents aggregate step-level counts for one organization, month, workflow, and ordered step.

The dataset does not expose user/session/event identifiers, so no unique-user grain may be claimed.

## PDPA Data Classification

No source documentation establishes formal PDPA classification values for these columns.

For drafting:

| Column group | `pdpa_classification` | Calibration owner |
| --- | --- | --- |
| all current source columns | `null` | Data Governance / assignment owner |

Do not infer organization identifiers to be personal identifiers without a source-backed classification decision.
