# DASHBOARD_SPEC.md

## Dashboard Inventory

### UX Workflow Funnel Dashboard

Single MVP application with three functional areas:

1. CSV Upload & Validation
2. Workflow Overview
3. Selected Workflow Funnel Detail

Optional AI Investigation Brief is a bonus area and must not block the core dashboard.

## Dashboard Profiles

### CSV Upload & Validation

Shows selected file, validation state, row count, and actionable error details. A failed upload must not replace the active valid dataset.

### Workflow Overview

For the active organization/month filter scope, show each `workflow_name` with:

- workflow started count
- workflow completed count
- `workflow_completion_rate`

Allow workflow selection from this view.

**Implemented (current MVP):** a KPI summary row above this section shows
Active Workflows (count of workflows returned for the active scope), Total
Started, Total Completed, and Overall Completion Rate — the latter three
computed client-side from the same `/api/workflows` response by summing
counts first and then dividing (per `METRIC_LOGIC.md`'s "sum counts first,
then calculate ratios" rule), not by averaging per-workflow rates. This is
not a new backend metric; it reuses the existing per-workflow
`workflow_started`/`workflow_completed` values already served by the
existing API. The workflow list itself is rendered as a horizontal bar
chart (completion rate per workflow) alongside the required table, with a
"View funnel" action per row.

### Selected Workflow Funnel Detail

For the chosen workflow, render ascending steps with:

- `step_order`
- `step_name`
- started count
- completed count
- `step_dropoff_count`
- `step_dropoff_rate`

Show a separate textual callout for `highest_dropoff_step`.

**Implemented (current MVP):** this section also shows a small KPI row for
the selected workflow (Completion Rate, Total Started, Total Completed —
looked up from the already-fetched workflow overview row — and Highest
Drop-off Step), a visual step funnel (bar width represents progression
through the funnel; each step's bar is split into a completed segment and a
drop-off segment, no animation), and the ordered step table. The
highest-drop-off step is highlighted with a red warning treatment (card,
funnel bar, and table row) rather than color alone — the step name is also
marked with a ⚠ text indicator. Before a workflow is selected, a plain
neutral empty-state message is shown instead of the funnel/table.

## Metric Coverage Matrix

| Dashboard area | Metric |
| --- | --- |
| Workflow Overview | `workflow_completion_rate` |
| Funnel Detail | `step_dropoff_count` |
| Funnel Detail | `step_dropoff_rate` |
| Funnel Detail | `highest_dropoff_step` |

Metric definitions and formulas come only from `METRIC_SPEC.md` / `METRIC_LOGIC.md`.

## Drill-down Logic

Supported scope controls:

- `period_month`: all available or selected month(s)
- `organization_id`: all available or selected organization(s)
- `workflow_name`: one workflow for funnel detail

Workflow overview responds to organization/month scope. Funnel detail additionally responds to selected workflow.

No user-level drill-down exists because the CSV contains no user identifier.

## Refresh Schedule

MVP refresh trigger: successful validated CSV import and user filter changes.

No recurring scheduled refresh cadence is supplied by the assignment.

Scheduled refresh cadence: `null`

Calibration owner: t-reg product/UX owner.
