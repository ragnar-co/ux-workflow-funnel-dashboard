# Claude Code / Codex Instructions — UX Workflow Funnel Dashboard

## Project mode

Build `UX Workflow Funnel Dashboard` using `ddd-data-analytics` as the single DDD track.

Do not model the project around web-app bounded contexts, entities, aggregates, or repositories. The application UI is an output surface over the analytics document chain.

## Read order

1. `START_HERE.md`
2. `PROJECT_STATUS.md`
3. `docs/analytics/STAKEHOLDERS.md`
4. `docs/analytics/CONSTRAINTS.md`
5. `docs/analytics/KPI_DICTIONARY.md`
6. `docs/analytics/BUSINESS_GLOSSARY.md`
7. `docs/analytics/DATA_PROFILE.md`
8. `docs/analytics/METRIC_SPEC.md`
9. `docs/analytics/DATA_MODEL_SPEC.md`
10. `docs/analytics/METRIC_LOGIC.md`
11. `docs/analytics/PIPELINE_SPEC.md`
12. `docs/analytics/DATA_QUALITY.md`
13. `docs/analytics/TESTING_STRATEGY.md`
14. `docs/analytics/VIZ_DESIGN_SPEC.md`
15. `docs/analytics/DASHBOARD_SPEC.md`
16. `docs/analytics/TASKS.md`
17. `ddd-data-analytics/reference/manual/01-GOV-01-authority-truth-and-claims.md`
18. `ddd-data-analytics/reference/manual/04-SPEC-01-doc-map.md`
19. `ux-reference/README.md`

## UX/UI direction to preserve

Use the original Ragnar NPS project as a visual and interaction reference only.

Preserve where useful:

- sidebar + topbar application shell
- light gray workspace and white rounded cards
- design tokens and spacing rhythm
- compact metric cards
- upload -> preview -> validate flow
- tables, filters, drawers, modals and selectors
- LINE Seed Sans Thai if available in the project assets

Replace NPS-specific content and domain logic with workflow-funnel analytics.

## Confirmed project facts

- Project: `UX Workflow Funnel Dashboard`
- Primary user role: UX/UI + analyst
- DDD: `ddd-data-analytics`
- Database: `DuckDB`
- Source CSV: `data/raw/numnim_ux_funnel_mock.csv`
- Source grain: `organization_id + period_month + workflow_name + step_order`
- Required output: workflow completion overview, selectable workflow funnel, step drop-off count/rate, highest drop-off step
- Delivery constraint: complete within 120 minutes
- Must include at least one passing Test or Validation
- Must be deployable through Coolify
- Must be pushed to company repository
- Token/top-up constraint: use existing Claude Code/Codex token allocation; no additional purchase

## Data and metric rules

- Use `docs/analytics/METRIC_SPEC.md` as metric definition authority.
- Use `docs/analytics/METRIC_LOGIC.md` as SQL/calculation authority.
- Sum counts first, then calculate ratios. Do not average row-level percentages.
- Do not claim unique users; the CSV contains aggregate counts and no user identifier.
- A high drop-off step is an investigation target, not proof of UX root cause.
- Do not invent quality thresholds, anomaly bounds, freshness tolerance, retention, cost ceilings, project budget, or model acceptance values.

## Implementation rule

Use the validated source file as the initial fixture and support user upload in the app.

Re-run validation with:

```bash
python3 scripts/validate_input.py data/raw/numnim_ux_funnel_mock.csv
```

The persistent runtime database target is:

`data/app/ux_workflow_funnel.duckdb`

## MVP UI intent

The first usable screen should help a UX analyst answer:

1. Which workflow has lower completion?
2. Which step has the largest observed drop-off?
3. How many source counts fail at each step?
4. Which workflow and step should be studied further?

Expected UI sections:

- CSV upload and validation status
- workflow summary table/cards
- optional month/organization filters
- workflow selector
- ordered funnel visualization
- per-step started/completed/drop-off count/drop-off rate
- highest-drop-off callout

## Bonus AI

Only after the core dashboard passes validation, optionally create a draft `UX Investigation Brief` using the company AI endpoint. Treat generated hypotheses and usability-testing questions as draft investigation material, not observed facts.
