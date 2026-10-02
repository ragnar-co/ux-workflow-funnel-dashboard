# Project Status

## Confirmed

- Project: UX Workflow Funnel Dashboard
- DDD: ddd-data-analytics v2.8.0
- User role: UX/UI + analyst
- Database: DuckDB
- UX/UI visual reference: Ragnar NPS package supplied by user
- Assignment source: `data/raw/numnim_ux_funnel_mock.csv`
- Source rows: 21,600
- Organizations: 200
- Periods: 9 months (`2026-01` through `2026-09`)
- Workflows: Consent Setup, Data Breach Report, Data Subject Request, RoPA
- Row grain: `organization_id + period_month + workflow_name + step_order`
- Source validation: passed
- Time constraint: 120 minutes
- Delivery constraints: at least one Test or Validation passes, push to company repo, deploy through Coolify

## Confirmed source behavior

- exact required columns are documented in `DATA_PROFILE.md`
- no null required fields observed
- no duplicate natural keys observed
- no negative counts observed
- no row has `completed_count > started_count`
- step order is contiguous and begins at 1
- next-step started count equals previous-step completed count across all observed transitions

## Ready analytics specifications

Core implementation specs are present through `DASHBOARD_SPEC.md` and `TASKS.md` under `docs/analytics/`.

## Still implementation-specific / not supplied

- application framework
- company repository provider and branch/PR requirements
- Coolify deployment convention used by the company
- AI endpoint schema, auth method, model identifier, and quota for bonus work
- calibrated quality/anomaly/freshness/retention/cost/model thresholds not provided by the assignment

## DDD dependency rule

Follow `ddd-data-analytics/reference/manual/04-SPEC-01-doc-map.md`.
Do not manufacture a later canonical DDD document when its `depends_on` inputs are absent.
