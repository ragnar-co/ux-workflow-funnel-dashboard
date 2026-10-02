# DATA_QUALITY.md

## Null and Completeness Checks

Required fields:

- `organization_id`
- `period_month`
- `workflow_name`
- `step_order`
- `step_name`
- `started_count`
- `completed_count`

Supplied CSV result: zero null/empty values observed in required fields.

Calibrated tolerated null-rate threshold: `null`

Calibration owner: t-reg product/UX owner with Engineering/Data owner.

For the MVP import path, any missing required value is rejected because every field is required by the current metric/model definition.

## Range and Validity Checks

- `step_order` parses as integer and is `>= 1`
- `started_count` parses as integer and is `>= 0`
- `completed_count` parses as integer and is `>= 0`
- `completed_count <= started_count`
- `period_month` parses as a valid `YYYY-MM` month
- composite key `organization_id + period_month + workflow_name + step_order` is unique
- step order begins at 1 and is contiguous inside each organization-month-workflow group
- next-step `started_count` equals previous-step `completed_count` inside each organization-month-workflow group

Supplied CSV passes all rules above.

## Referential Integrity Checks

The MVP model has no physical foreign-key relationships.

Logical consistency checks:

- each `workflow_name + step_order` maps to one stable `step_name` in the supplied dataset
- ordered steps remain consistent within the source groups

Supplied CSV has zero conflicting `step_name` mappings for a workflow/step order.

## Anomaly Detection Rules

No calibrated statistical anomaly bound is supplied.

- anomaly bound: `null`
- calibration owner: t-reg product/UX owner with Analytics owner

Do not invent z-score, percentage-change, or volume thresholds for the MVP.

## Quality Dashboards

The application upload result should display a compact validation summary containing:

- file name
- row count
- pass/fail state
- validation errors when present
- number of workflows available after load

This is an import-quality status view, not a separate analytics dashboard.
