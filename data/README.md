# Data

## Source file

`raw/numnim_ux_funnel_mock.csv`

This is the assignment CSV supplied by the user. It is UTF-8 with BOM and contains 21,600 data rows plus one header row.

Confirmed columns:

- `organization_id`
- `period_month`
- `workflow_name`
- `step_order`
- `step_name`
- `started_count`
- `completed_count`

Confirmed row grain:

`organization_id + period_month + workflow_name + step_order`

Do not infer unique users from these aggregate counts.

The persistent DuckDB file should be created at `app/ux_workflow_funnel.duckdb` at runtime and should not be committed unless the assignment explicitly requires it.
