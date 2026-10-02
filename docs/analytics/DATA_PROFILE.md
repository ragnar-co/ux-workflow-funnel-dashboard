# DATA_PROFILE.md

Supporting analysis document for the supplied CSV. This is not one of the 23 canonical DDD deliverables.

## Source

- File: `data/raw/numnim_ux_funnel_mock.csv`
- Encoding: UTF-8 with BOM
- Data rows: 21,600
- Organizations: 200
- Months: 9 (`2026-01` through `2026-09`)
- Workflows: 4 (`Consent Setup`, `Data Breach Report`, `Data Subject Request`, `RoPA`)
- Workflow-period-organization groups: 7,200

## Confirmed Schema

| Column | Observed role |
| --- | --- |
| `organization_id` | organization grouping key |
| `period_month` | monthly period in `YYYY-MM` form |
| `workflow_name` | workflow identifier/name |
| `step_order` | positive integer order inside workflow |
| `step_name` | display name for the step |
| `started_count` | aggregate count starting the step |
| `completed_count` | aggregate count completing the step |

## Confirmed Grain

One row per:

`organization_id + period_month + workflow_name + step_order`

No duplicate rows were observed for this composite key.

## Validation Results on Supplied File

- required-field nulls: 0
- non-numeric values in numeric columns: 0
- negative counts or `step_order < 1`: 0
- rows where `completed_count > started_count`: 0
- duplicate composite keys: 0
- conflicting `step_name` for the same `workflow_name + step_order`: 0
- workflow groups whose first step is not step 1: 0
- workflow groups with gaps in `step_order`: 0
- cross-step mismatches where next `started_count` differs from previous `completed_count`: 0 across 14,400 transitions

## Interpretation Boundary

The file contains aggregate counts. It does not contain a user identifier, session identifier, or event identifier. Therefore the dashboard must describe counts/attempts/instances from the source and must not claim unique-user conversion unless a separate source contract establishes that meaning.
