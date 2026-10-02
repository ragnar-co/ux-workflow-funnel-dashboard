# Claude Code Task 01 — Build Core Analytics MVP

The source-inspection stage is complete. The actual CSV is present and validated.

## Read

1. `START_HERE.md`
2. `CLAUDE.md`
3. `PROJECT_STATUS.md`
4. `docs/analytics/DATA_PROFILE.md`
5. `docs/analytics/METRIC_SPEC.md`
6. `docs/analytics/DATA_MODEL_SPEC.md`
7. `docs/analytics/METRIC_LOGIC.md`
8. `docs/analytics/PIPELINE_SPEC.md`
9. `docs/analytics/DATA_QUALITY.md`
10. `docs/analytics/TESTING_STRATEGY.md`
11. `docs/analytics/VIZ_DESIGN_SPEC.md`
12. `docs/analytics/DASHBOARD_SPEC.md`
13. `docs/analytics/TASKS.md`
14. `ux-reference/README.md`

## First action

Run:

```bash
python3 scripts/validate_input.py data/raw/numnim_ux_funnel_mock.csv
```

It must exit 0 before implementing the load path.

## Core build sequence

1. choose the lightest web framework compatible with Coolify and the timebox
2. implement validated CSV upload
3. persist active valid data to `data/app/ux_workflow_funnel.duckdb`
4. implement parameterized DuckDB metric queries
5. adapt the UX reference into the workflow overview and funnel detail
6. add automated tests from `TESTING_STRATEGY.md`
7. add Docker/Coolify configuration
8. run a local smoke test
9. prepare repo push/deploy instructions

## Rules

- Keep `DuckDB`.
- Analytics documents are source of truth; UX reference is presentation reference only.
- No NPS business logic.
- No unique-user claims.
- No fabricated thresholds/SLA/retention/cost/model acceptance values.
- Core assignment before optional AI bonus.
