# App implementation area

Build the production web app here. Reuse visual patterns from `../ux-reference/`, but use `../docs/analytics/` as the analytics source of truth.

Core runtime responsibilities:

- CSV upload and validation
- DuckDB persistence at `../data/app/ux_workflow_funnel.duckdb`
- parameterized metric queries
- workflow overview and selected-workflow funnel
- highest-drop-off callout
- Coolify-compatible container entry point
