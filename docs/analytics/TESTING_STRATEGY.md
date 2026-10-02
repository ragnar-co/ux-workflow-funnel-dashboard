# TESTING_STRATEGY.md

## Unit Tests (dbt / SQL)

This MVP does not require dbt. Implement equivalent unit tests in the selected application test framework for:

- required-column validation
- numeric parsing
- non-negative counts
- `completed_count <= started_count`
- composite-key uniqueness
- contiguous `step_order`
- cross-step continuity
- divide-by-zero behavior

**Implemented (current MVP):** required-column validation, numeric parsing,
non-negative counts, `completed_count <= started_count`, composite-key
uniqueness, contiguous `step_order`, and cross-step continuity are enforced
by `scripts/validate_input.py` (reused by the upload path via
`app/validation.py`) and exercised indirectly through the integration and
invalid-CSV tests below. Divide-by-zero (`step_dropoff_rate` is `null` when
`started_count = 0`) has a direct unit test in `tests/test_metrics.py`.

## Integration Tests

At least one automated test must execute the full core path against a temporary DuckDB database:

1. load a valid fixture CSV
2. validate it
3. persist rows
4. query workflow and step metrics
5. assert expected results

A failing input must not overwrite the previously valid active dataset.

**Implemented (current MVP):** `tests/test_integration.py` loads
`tests/fixtures/golden_funnel.csv` into a temporary DuckDB file, persists
it, and asserts the active dataset metadata; a second test loads that valid
fixture, then attempts `tests/fixtures/invalid_funnel.csv`
(`completed_count > started_count`), asserts it is rejected, and asserts the
active dataset is unchanged.

## Metric Validation Tests

Use a small golden fixture with explicitly known values. Minimum assertions:

- `step_dropoff_count = started - completed`
- `step_dropoff_rate = dropoff / started`
- `workflow_completion_rate = final completed / first started`
- `highest_dropoff_step` returns the maximum rate and uses lowest `step_order` on ties

Do not use the TaskFlow case values as expected project values.

**Implemented (current MVP):** `tests/test_metrics.py` asserts all four
rules above against `tests/fixtures/golden_funnel.csv` (values invented
solely for this fixture, not project KPI targets), plus the
`step_started = 0` → `step_dropoff_rate is None` edge case.

## Dashboard Acceptance Tests

Verify that the deployed app can:

- upload a valid CSV and show validation success
- reject an invalid CSV with a reason
- show completion rate for each workflow
- select a workflow
- show steps in `step_order`
- show step started/completed/drop-off count/drop-off rate
- highlight the highest-drop-off step
- preserve/reload the active dataset from DuckDB after process restart when persistent storage is mounted

**Implemented (current MVP):** all of the above were verified by manual and
Playwright-driven local smoke testing against the running app (including the
Docker container) — this is not an automated CI suite, just a recorded
interactive pass. Preserve/reload after restart was verified at the process
level (the app does not reload the fixture over an existing active
dataset); it has not been verified against a real Coolify volume mount yet.

## Test Automation and CI

Assignment minimum: at least one Test or Validation must pass before delivery.

Recommended delivery command: one test command that exits non-zero on failure and can be run locally and in company CI.

**Implemented (current MVP):** `python3 -m pytest tests/ -q` — 7 tests,
currently passing. Exits non-zero on failure, runnable locally and in CI
without any external service.

Test coverage expectation: `null`

Calibration owner: Engineering / Delivery Owner.
