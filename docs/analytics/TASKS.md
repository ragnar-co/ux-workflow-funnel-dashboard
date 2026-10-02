# TASKS.md

## Task Breakdown

1. bootstrap the app using the existing UX reference without importing NPS domain logic
2. implement CSV upload and validation rules from `DATA_QUALITY.md`
3. implement DuckDB persistence from `PIPELINE_SPEC.md`
4. implement metric queries from `METRIC_LOGIC.md`
5. build workflow overview
6. build selected-workflow funnel detail
7. add highest-drop-off callout
8. add automated test/validation command
9. add Docker/Coolify runtime configuration
10. run smoke test, push to company repo, deploy
11. only then consider the optional AI Investigation Brief

## Task Sequence and Dependencies

```text
validate source
  -> DuckDB load
  -> metric SQL
  -> workflow overview
  -> funnel detail
  -> tests
  -> container/deploy
  -> smoke test
  -> optional AI bonus
```

Do not start the AI bonus while any core assignment acceptance item is failing.

## Definition of Done

Core delivery is done when:

- supplied CSV can be uploaded/loaded successfully
- invalid CSV is rejected without corrupting active data
- valid data persists in DuckDB
- all workflows show completion rate
- workflow selection shows ordered funnel detail
- each step shows drop-off count and rate
- highest-drop-off step is identified
- at least one automated Test or Validation passes
- deployment opens successfully through Coolify
- source is pushed to the company repository

## Assignments and Estimates

Assignment delivery window: 120 minutes total.

Suggested timeboxing, not a template standard:

| Work | Owner | Timebox |
| --- | --- | --- |
| source + DDD confirmation | UX/UI Analyst + Claude Code | 10 min |
| ingestion + DuckDB | Claude Code | 25 min |
| metric queries | Claude Code | 20 min |
| dashboard UI adaptation | UX/UI Analyst + Claude Code | 30 min |
| tests/validation | Claude Code | 15 min |
| Docker/Coolify + smoke test + repo push | Engineering/Delivery Owner + Claude Code | 20 min |

Named engineering/deployment owner is not supplied.
