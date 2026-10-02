# UX Workflow Funnel Dashboard — Claude Code Handoff

This package is structured to build the assignment as a web app while using `ddd-data-analytics` as the only DDD track.

## Package structure

```text
ux-workflow-funnel-dashboard/
├── START_HERE.md
├── CLAUDE.md
├── CLAUDE_CODE_PROMPT.md
├── CLAUDE_TASK_01.md
├── PROJECT_STATUS.md
├── data/
│   ├── raw/numnim_ux_funnel_mock.csv
│   ├── processed/source_validation_report.json
│   └── app/                  # runtime DuckDB location
├── docs/analytics/           # project analytics source of truth
├── ddd-data-analytics/       # v2.8.0 reference/manual
├── ux-reference/             # Ragnar NPS visual/interaction reference only
├── config/
├── scripts/validate_input.py
├── app/                      # implementation area
└── tests/                    # automated tests
```

## Source data

`data/raw/numnim_ux_funnel_mock.csv` is the actual assignment CSV supplied by the user.

The included source validator currently passes and writes its result to:

`data/processed/source_validation_report.json`

## DDD status

The real CSV has already been inspected. Core analytics documents have therefore been advanced through metric, data model, metric logic, pipeline, data quality, testing, visualization, dashboard, and task specifications.

Use `docs/analytics/` as the project source of truth.

## UX reference

`ux-reference/` preserves the Ragnar NPS design direction for reuse of layout and interaction patterns. It is not a source of analytics business rules.

## Start Claude Code

Open the project directory and provide the contents of `CLAUDE_CODE_PROMPT.md`, or tell Claude Code:

```text
Read START_HERE.md and CLAUDE.md, validate the included CSV, then implement TASKS.md in order.
```
