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

### Selected Workflow Funnel Detail

For the chosen workflow, render ascending steps with:

- `step_order`
- `step_name`
- started count
- completed count
- `step_dropoff_count`
- `step_dropoff_rate`

Show a separate textual callout for `highest_dropoff_step`.

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
