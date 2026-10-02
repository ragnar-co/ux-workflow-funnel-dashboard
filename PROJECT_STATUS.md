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

## Implementation status (current)

- Application framework: FastAPI (Python) + DuckDB (`duckdb` Python package)
  + vanilla JS/CSS frontend (no build step), chosen for the 120-minute
  delivery window and Coolify compatibility.
- CSV upload + validation implemented (`app/validation.py` reuses
  `scripts/validate_input.py`'s rules); a failed upload never replaces the
  active dataset.
- DuckDB persistence implemented at `data/app/ux_workflow_funnel.duckdb`
  (`app/db.py`): atomic staging-table replace, `import_meta` tracks the
  active dataset's file/row/workflow counts.
- Metric queries implemented per `METRIC_LOGIC.md` (`app/metrics.py`):
  workflow completion rate, step drop-off count/rate, highest-drop-off
  step (lowest-`step_order` tie-break).
- Dashboard UI implemented and redesigned: searchable multi-select
  organization/month filters, KPI summary cards, workflow completion bar
  chart + table, selected-workflow funnel visualization with a highlighted
  highest-drop-off step.
- Automated tests: 7 `pytest` tests passing — golden-fixture metric
  validation, full pipeline integration (temp DuckDB), invalid-CSV
  rejection. Run via `python3 -m pytest tests/ -q`.
- Dockerfile built and container-smoke-tested locally (same startup command
  Coolify would use).
- Git initialized locally with commits; **not yet pushed** — no company
  repository remote configured yet.
- AI Investigation Brief (bonus): **not implemented**, optional, deferred
  per the project rule that it only starts after the core dashboard passes.

## Still implementation-specific / not supplied

- company repository URL and branch/PR requirements
- Coolify project/volume-mount configuration used by the company (the
  Dockerfile declares a volume at `/srv/app/data/app`; it still needs to be
  mounted in the actual Coolify service)
- AI endpoint schema, auth method, model identifier, and quota for bonus work
- calibrated quality/anomaly/freshness/retention/cost/model thresholds not provided by the assignment

## DDD dependency rule

Follow `ddd-data-analytics/reference/manual/04-SPEC-01-doc-map.md`.
Do not manufacture a later canonical DDD document when its `depends_on` inputs are absent.
