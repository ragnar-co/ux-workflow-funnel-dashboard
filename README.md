# UX Workflow Funnel Dashboard

A UX/analyst dashboard for comparing workflow completion performance and
identifying the step with the highest observed drop-off, built on
`ddd-data-analytics` as the single DDD track. Status: **core MVP implemented
and smoke-tested locally**; AI Investigation Brief bonus is **not
implemented**.

## Stack

- Backend: FastAPI (Python) + DuckDB (`duckdb` Python package)
- Frontend: vanilla JS/CSS, no build step (Ragnar-inspired design tokens/shell)
- Persistence: `data/app/ux_workflow_funnel.duckdb`
- Tests: `pytest`
- Container: single `Dockerfile`, Coolify-deployable

See `docs/analytics/` for the analytics source of truth (metric definitions,
data model, pipeline, data quality, testing, viz, and dashboard specs) and
`ddd-data-analytics/reference/` for the DDD methodology this project follows.

## Features implemented

- CSV upload with validation before persistence (reuses
  `scripts/validate_input.py`'s rules); a failed upload never replaces the
  active dataset
- DuckDB persistence of `fct_workflow_funnel_step`, atomic full-file replace
  on each successful load
- Searchable multi-select filters (type-to-filter, chips, clear action) for
  `organization_id` and `period_month`; empty selection = all values
- KPI summary cards: Active Workflows, Total Started, Total Completed,
  Overall Completion Rate (sum-then-ratio across the active filter scope,
  per `METRIC_LOGIC.md`'s aggregation convention — not an averaged rate)
- Workflow completion performance: horizontal bar chart + sortable-by-rate
  table (started / completed / completion rate / view funnel)
- Selected-workflow funnel detail: ordered step funnel visualization,
  per-step started/completed/drop-off count/drop-off rate, and a
  highlighted Highest Drop-off Step (red warning treatment, not color alone)
- At least one passing automated test (`pytest`, 7 tests — see below)
- Dockerfile builds and runs the app the same way Coolify would

## Quick start (local)

```bash
pip install -r requirements.txt
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000`. On first run with an empty
`data/app/ux_workflow_funnel.duckdb`, the app auto-loads the validated fixture
CSV at `data/raw/numnim_ux_funnel_mock.csv`.

## Validate the source CSV

```bash
python3 scripts/validate_input.py data/raw/numnim_ux_funnel_mock.csv
```

Last known result (also at `data/processed/source_validation_report.json`):
21,600 rows, 200 organizations, 9 months (2026-01–2026-09), 4 workflows,
0 errors.

## Run tests

```bash
python3 -m pytest tests/ -q
```

Covers: step drop-off count/rate, highest-drop-off step selection
(including the lowest-`step_order` tie-break), workflow completion rate,
the zero-`started_count` null-rate edge case, a full load→persist→query
integration pass, and invalid-CSV rejection (active dataset preserved).

## Run with Docker (Coolify-equivalent)

```bash
docker build -t ux-workflow-funnel-dashboard .
docker run -p 8000:8000 -v "$(pwd)/data/app:/srv/app/data/app" ux-workflow-funnel-dashboard
```

Mount a persistent volume at `/srv/app/data/app` in Coolify so an uploaded
dataset survives redeploys.

## Package structure

```text
ux-workflow-funnel-dashboard/
├── START_HERE.md
├── CLAUDE.md
├── PROJECT_STATUS.md
├── Dockerfile
├── requirements.txt
├── conftest.py
├── data/
│   ├── raw/numnim_ux_funnel_mock.csv
│   ├── processed/source_validation_report.json
│   └── app/                       # runtime DuckDB (gitignored)
├── docs/analytics/                # project analytics source of truth
├── ddd-data-analytics/            # v2.8.0 reference/manual
├── ux-reference/                  # Ragnar NPS visual/interaction reference only
├── config/
├── scripts/validate_input.py
├── app/
│   ├── main.py                    # FastAPI app + routes
│   ├── db.py                      # DuckDB schema + atomic load
│   ├── metrics.py                 # parameterized metric SQL
│   ├── validation.py              # reuses scripts/validate_input.py
│   └── static/                    # index.html / styles.css / app.js
└── tests/                         # pytest suite + fixtures
```

## DDD status

`docs/analytics/` remains the project source of truth for metric and data
model rules. `ux-reference/` is visual/interaction reference only — no NPS
business logic or metrics were carried into this project.

## Deployment

- Dockerfile builds and has been container-smoke-tested locally (serves the
  full dataset end to end).
- Not yet pushed to the company repository — no remote configured yet.
- AI Investigation Brief (bonus) is optional and intentionally not started,
  per the project rule that it only begins after the core dashboard passes.
