# PIPELINE_SPEC.md

## Pipeline Overview

MVP flow:

`CSV upload -> schema/type validation -> funnel consistency validation -> DuckDB transaction -> metric queries -> dashboard`

Only validated data may become the active analytics dataset.

## Pipeline Definitions

### `csv_import_pipeline`

1. accept uploaded CSV
2. decode UTF-8 / UTF-8 with BOM
3. confirm exact required columns
4. parse and validate rows
5. run natural-key and ordered-funnel consistency checks
6. load into a staging relation/table
7. replace the active `fct_workflow_funnel_step` dataset atomically inside a DuckDB transaction
8. commit only when all checks pass
9. return an import validation summary to the UI

The atomic-replace behavior is the selected MVP implementation strategy for a single active uploaded dataset. If append/history behavior is required later, update `DATA_MODEL_SPEC.md` and this document first.

## Source Systems

Primary source:

`data/raw/numnim_ux_funnel_mock.csv`

Required columns are defined in `DATA_PROFILE.md` and `DATA_MODEL_SPEC.md`.

## Error Handling and Retry

- validation error: do not modify the active fact table; show field/rule-level reason
- DuckDB transaction/load error: rollback transaction and keep the previous active dataset
- metric-query error: show an application error state; do not silently substitute zeros
- retry: user may correct/re-upload the file; no automatic retry count is calibrated for this MVP

## Credentials & Secret Management

Core CSV/DuckDB path requires no external credential.

For optional AI bonus:

- use environment variables / Coolify secrets
- never commit endpoint tokens or API keys
- endpoint schema/auth are not yet supplied

## Load Strategy

MVP: validated full-file atomic replacement of the active fact table.

Persistent DuckDB target:

`data/app/ux_workflow_funnel.duckdb`

Use parameterized SQL for filter values. Keep raw source CSV separate from the runtime DuckDB file.
