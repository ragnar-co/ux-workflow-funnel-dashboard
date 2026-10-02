# Prompt to Start in Claude Code / Codex

```text
Build the UX Workflow Funnel Dashboard using ddd-data-analytics as the only DDD track.

Read START_HERE.md and CLAUDE.md first, then follow the analytics documents under docs/analytics/ in dependency order.

The real assignment CSV is already included at:
data/raw/numnim_ux_funnel_mock.csv

It has already passed the repository validation script. Re-run:
python3 scripts/validate_input.py data/raw/numnim_ux_funnel_mock.csv

Use DuckDB and implement the data/model/metric rules exactly from:
- docs/analytics/DATA_MODEL_SPEC.md
- docs/analytics/METRIC_SPEC.md
- docs/analytics/METRIC_LOGIC.md
- docs/analytics/PIPELINE_SPEC.md
- docs/analytics/DATA_QUALITY.md

Use the original Ragnar NPS project under ux-reference/ only as UX/UI reference. Reuse useful layout, design tokens, cards, table/filter patterns, and upload-preview-validation interaction. Do not reuse NPS bounded contexts, entities, aggregates, NPS metrics, or business rules.

Core acceptance:
- CSV upload
- validation before persistence
- persistent DuckDB dataset
- completion rate for each workflow
- workflow selector
- ordered funnel
- started/completed/drop-off count/drop-off rate by step
- highest-drop-off step
- at least one passing automated Test or Validation
- container/Coolify deployable
- ready to push to company repo

Do not claim unique users because the source has aggregate counts only.
Do not invent thresholds, anomaly bounds, freshness tolerance, retention, cost ceilings, project budget, or model acceptance values.
Do not start the AI bonus until the core dashboard passes.

Use docs/analytics/TASKS.md as the implementation sequence.
```
