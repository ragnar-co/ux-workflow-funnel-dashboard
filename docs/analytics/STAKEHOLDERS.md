# STAKEHOLDERS.md

## Stakeholder Profiles

### UX/UI Analyst

Status: confirmed from user role.

Primary responsibility:

- compare workflow completion performance
- select a workflow for deeper analysis
- identify a step that merits UX investigation
- use observed drop-off as evidence for follow-up research, not proof of root cause

### t-reg Team

Status: confirmed from assignment statement.

Business need:

- improve user experience
- understand which workflows complete less often
- understand which steps have the greatest observed drop-off
- prioritize what to study further

### Engineering / Delivery Owner

Status: required by implementation/deployment constraints; named person not supplied.

Responsibility:

- implement CSV ingestion, DuckDB persistence, metric queries, tests, repository push, and Coolify deployment

## Data Needs Matrix

| Stakeholder | Decision / task | Data needed | Current status |
| --- | --- | --- | --- |
| UX/UI Analyst | choose workflow for investigation | workflow-level completion comparison | supported by `workflow_completion_rate` |
| UX/UI Analyst | find problematic step | ordered step counts and drop-off indicators | supported by step metrics |
| t-reg Team | identify UX research focus | workflow + step evidence and context | supported by dashboard specification |
| Engineering / Delivery Owner | build and operate MVP | validated schema, DuckDB model, testable SQL logic | specified in downstream analytics docs |
