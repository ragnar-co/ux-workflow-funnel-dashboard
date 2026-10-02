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

## Integration Tests

At least one automated test must execute the full core path against a temporary DuckDB database:

1. load a valid fixture CSV
2. validate it
3. persist rows
4. query workflow and step metrics
5. assert expected results

A failing input must not overwrite the previously valid active dataset.

## Metric Validation Tests

Use a small golden fixture with explicitly known values. Minimum assertions:

- `step_dropoff_count = started - completed`
- `step_dropoff_rate = dropoff / started`
- `workflow_completion_rate = final completed / first started`
- `highest_dropoff_step` returns the maximum rate and uses lowest `step_order` on ties

Do not use the TaskFlow case values as expected project values.

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

## Test Automation and CI

Assignment minimum: at least one Test or Validation must pass before delivery.

Recommended delivery command: one test command that exits non-zero on failure and can be run locally and in company CI.

Test coverage expectation: `null`

Calibration owner: Engineering / Delivery Owner.
