# METRIC_LOGIC.md

## Metric SQL Implementations

Reference DuckDB SQL. Adapt table/schema names only if `DATA_MODEL_SPEC.md` is updated first.

### Step metrics

```sql
WITH step_metrics AS (
    SELECT
        workflow_name,
        step_order,
        step_name,
        SUM(started_count) AS step_started,
        SUM(completed_count) AS step_completed,
        SUM(started_count) - SUM(completed_count) AS step_dropoff_count,
        CASE
            WHEN SUM(started_count) = 0 THEN NULL
            ELSE (SUM(started_count) - SUM(completed_count))::DOUBLE
                 / SUM(started_count)
        END AS step_dropoff_rate
    FROM fct_workflow_funnel_step
    WHERE 1 = 1
      -- bind optional organization/month/workflow filters as parameters
    GROUP BY workflow_name, step_order, step_name
)
SELECT *
FROM step_metrics
ORDER BY workflow_name, step_order;
```

### Workflow completion

```sql
WITH scoped AS (
    SELECT
        workflow_name,
        step_order,
        SUM(started_count) AS step_started,
        SUM(completed_count) AS step_completed
    FROM fct_workflow_funnel_step
    WHERE 1 = 1
      -- bind optional organization/month filters as parameters
    GROUP BY workflow_name, step_order
), bounds AS (
    SELECT
        workflow_name,
        MIN(step_order) AS first_step,
        MAX(step_order) AS last_step
    FROM scoped
    GROUP BY workflow_name
)
SELECT
    s.workflow_name,
    MAX(CASE WHEN s.step_order = b.first_step THEN s.step_started END) AS workflow_started,
    MAX(CASE WHEN s.step_order = b.last_step THEN s.step_completed END) AS workflow_completed,
    CASE
        WHEN MAX(CASE WHEN s.step_order = b.first_step THEN s.step_started END) = 0 THEN NULL
        ELSE MAX(CASE WHEN s.step_order = b.last_step THEN s.step_completed END)::DOUBLE
             / MAX(CASE WHEN s.step_order = b.first_step THEN s.step_started END)
    END AS workflow_completion_rate
FROM scoped s
JOIN bounds b USING (workflow_name)
GROUP BY s.workflow_name
ORDER BY s.workflow_name;
```

### Highest drop-off step

Use the step-metric result for the selected workflow and order by:

```sql
ORDER BY step_dropoff_rate DESC NULLS LAST, step_order ASC
LIMIT 1
```

## Edge Case Handling

- `started_count = 0`: return `null` for `step_dropoff_rate`.
- empty filter result: show a no-data state, not zero-valued fabricated metrics.
- duplicate natural key: reject import before persistence.
- `completed_count > started_count`: reject import.
- missing/gapped step sequence inside an organization-month-workflow group: reject import for the MVP.
- next step `started_count != previous step completed_count`: fail funnel continuity validation for the MVP.
- multiple rows may be aggregated across organizations/months; sum counts first, then calculate ratios.
- do not average row-level percentages.

## Transformation Dependencies

1. source CSV passes validation from `DATA_QUALITY.md`
2. validated rows persist to `fct_workflow_funnel_step`
3. metric queries operate only on the persisted validated table
4. dashboard uses these metric outputs rather than recomputing competing formulas in UI code
