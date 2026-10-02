# START HERE — UX Workflow Funnel Dashboard

Project DDD: `ddd-data-analytics v2.8.0`
Role profile: UX/UI + `analyst`
Database: `DuckDB`

## Goal

Build a web app named **UX Workflow Funnel Dashboard** that:

- accepts CSV input
- validates input
- persists valid data in DuckDB
- shows workflow completion rate
- lets the user select a workflow
- shows an ordered funnel
- shows drop-off count and rate by step
- identifies the step with the highest drop-off rate
- includes at least one passing Test or Validation
- is ready for company repo + Coolify deployment

Bonus, only after core requirements pass: generate and persist a draft UX Investigation Brief using the company AI endpoint/quota.

## Start with the real assignment data

Source CSV:

`data/raw/numnim_ux_funnel_mock.csv`

Validated source facts:

- 21,600 rows
- 200 organizations
- 9 months (`2026-01` to `2026-09`)
- 4 workflows
- row grain: `organization_id + period_month + workflow_name + step_order`
- source validation currently passes

Validation report:

`data/processed/source_validation_report.json`

Re-run:

```bash
python3 scripts/validate_input.py data/raw/numnim_ux_funnel_mock.csv
```

## Authority

1. Read `CLAUDE.md` first.
2. DDD authority is under `ddd-data-analytics/reference/`.
3. Project DDD documents live under `docs/analytics/`.
4. `ux-reference/` is visual/interaction reference only.
5. Do not treat Ragnar NPS domain rules or its old Web App DDD as project truth.

## Ready-to-code DDD chain

The source data has been inspected and the dependency chain has been advanced through:

- `STAKEHOLDERS.md`
- `CONSTRAINTS.md`
- `KPI_DICTIONARY.md`
- `BUSINESS_GLOSSARY.md`
- `METRIC_SPEC.md`
- `DATA_MODEL_SPEC.md`
- `METRIC_LOGIC.md`
- `PIPELINE_SPEC.md`
- `DATA_QUALITY.md`
- `TESTING_STRATEGY.md`
- `VIZ_DESIGN_SPEC.md`
- `DASHBOARD_SPEC.md`
- `TASKS.md`

`DATA_PROFILE.md` is a supporting, non-canonical source inspection document.

Unknown calibrated thresholds/SLA/retention/cost values remain `null` with an owner. Do not invent them.
