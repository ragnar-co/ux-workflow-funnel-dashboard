# METRIC_SPEC.md

## Metric Profiles

### `workflow_completion_rate`

Purpose: compare end-to-end completion performance across workflows inside the active filter scope.

Definition: final-step completed count divided by first-step started count after aggregating source rows within the selected scope.

Unit: ratio, normally displayed as percentage.

Interpretation: lower values indicate more aggregate loss through the workflow. This metric does not prove UX root cause.

### `step_dropoff_count`

Purpose: show the aggregate count that starts a step but does not complete that same step.

Definition: `started_count - completed_count` after aggregation at workflow step.

Unit: count.

### `step_dropoff_rate`

Purpose: compare relative loss at each step.

Definition: `step_dropoff_count / started_count` after aggregation at workflow step.

Unit: ratio, normally displayed as percentage.

If aggregated `started_count = 0`, the rate is `null` rather than dividing by zero.

### `highest_dropoff_step`

Purpose: identify the observed step that merits UX investigation first inside the selected workflow and filter scope.

Definition: the step with the maximum non-null `step_dropoff_rate`. If multiple steps tie, choose the lowest `step_order` for deterministic display.

This is an investigation target, not evidence of causal UX failure.

## Formula Reference

```text
step_started = SUM(started_count)
step_completed = SUM(completed_count)
step_dropoff_count = step_started - step_completed
step_dropoff_rate = step_dropoff_count / step_started
```

```text
workflow_started = SUM(started_count) at MIN(step_order) per workflow
workflow_completed = SUM(completed_count) at MAX(step_order) per workflow
workflow_completion_rate = workflow_completed / workflow_started
```

The active filter scope may include one or more `organization_id` and `period_month` values. Counts are summed before ratios are calculated.

## Grain and Filter Matrix

| Metric | Calculation grain | Supported filters | Display grain |
| --- | --- | --- | --- |
| `workflow_completion_rate` | workflow within active scope | `organization_id`, `period_month`, `workflow_name` | one row/card per workflow |
| `step_dropoff_count` | workflow + step within active scope | `organization_id`, `period_month`, `workflow_name` | one value per ordered step |
| `step_dropoff_rate` | workflow + step within active scope | `organization_id`, `period_month`, `workflow_name` | one value per ordered step |
| `highest_dropoff_step` | selected workflow within active scope | `organization_id`, `period_month`, `workflow_name` | one highlighted step |

The source grain is `organization_id + period_month + workflow_name + step_order`.

## Action Thresholds

No calibrated business threshold for acceptable completion or drop-off is supplied by the assignment.

- completion action threshold: `null`
- drop-off action threshold: `null`
- calibration owner: t-reg product/UX owner

For the MVP, prioritization is comparative: surface the observed maximum `step_dropoff_rate` without labeling it against an invented good/bad threshold.
