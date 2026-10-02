# KPI_DICTIONARY.md

## KPI Catalog

### Workflow Completion Performance

Business question: which workflow has lower observed end-to-end completion and may deserve investigation?

KPI intent: compare completion performance across workflows using `workflow_completion_rate` from `METRIC_SPEC.md`.

### Step Drop-off Performance

Business question: at which ordered step does the selected workflow lose the highest proportion of started counts?

KPI intent: identify the step that should be prioritized for UX investigation using `step_dropoff_rate` and `highest_dropoff_step` from `METRIC_SPEC.md`.

## KPI Hierarchy (CEO to Team Level)

No organization-wide CEO-level hierarchy is supplied.

Project-level hierarchy:

- t-reg team objective: improve workflow experience
- UX analysis KPI: workflow completion performance
- UX analysis KPI: step drop-off performance

This hierarchy is project-specific and must not be generalized to the organization.

## Measurement Frequency

MVP measurement trigger: after a validated dataset import and whenever active filters change.

Scheduled refresh cadence: `null`

Calibration owner: t-reg product/UX owner.

## KPI Owners

| KPI | Business owner | Analytics owner |
| --- | --- | --- |
| Workflow Completion Performance | t-reg product/UX owner — named person pending | UX/UI Analyst |
| Step Drop-off Performance | t-reg product/UX owner — named person pending | UX/UI Analyst |
