# DDD Migration — Web App Framing to Data Analytics

## Purpose

Keep the existing visual language and interaction patterns while replacing the old application-domain DDD framing with the canonical `ddd-data-analytics` document chain.

## Keep

- application shell and visual hierarchy
- design tokens
- reusable presentational components
- upload/preview/validate interaction concept
- navigation interaction patterns
- responsive layout behavior

## Replace

The old `DDD_BRIEF.md` concepts are not the source of truth for this project:

| Old web-app framing | Analytics replacement |
| --- | --- |
| Bounded Contexts | analytics document ownership and dependencies |
| Entities/Aggregates | fact/dimension model, defined later in `DATA_MODEL_SPEC.md` |
| NPS domain rules | KPI/metric definitions for workflow completion and drop-off |
| NPS analysis | `METRIC_SPEC.md` + `METRIC_LOGIC.md` after dependencies exist |
| upload domain aggregate | source contract + pipeline + quality rules after dependencies exist |
| reporting bounded context | `VIZ_DESIGN_SPEC.md`, `DASHBOARD_SPEC.md`, `REPORT_SPEC.md` |

## Canonical dependency path for this project

```text
STAKEHOLDERS.md ─┐
KPI_DICTIONARY.md ├─> METRIC_SPEC.md -> DATA_MODEL_SPEC.md -> METRIC_LOGIC.md
BUSINESS_GLOSSARY.md ┘                                      |
                                                            v
                                                      PIPELINE_SPEC.md
                                                            |
                                                     DATA_QUALITY.md
                                                            |
                                                TESTING_STRATEGY.md

STAKEHOLDERS.md + METRIC_SPEC.md -> VIZ_DESIGN_SPEC.md

METRIC_SPEC.md + KPI_DICTIONARY.md + DATA_MODEL_SPEC.md
+ STAKEHOLDERS.md + TESTING_STRATEGY.md + VIZ_DESIGN_SPEC.md
-> DASHBOARD_SPEC.md
```

## Current stop point

The real CSV has not yet been inspected in this overlay. Therefore the following remain intentionally unwritten:

- `METRIC_SPEC.md`
- `DATA_MODEL_SPEC.md`
- `METRIC_LOGIC.md`
- `DATA_CONTRACT.md`
- `PIPELINE_SPEC.md`
- `DATA_QUALITY.md`
- `TESTING_STRATEGY.md`
- `VIZ_DESIGN_SPEC.md`
- `DASHBOARD_SPEC.md`

This prevents guessed grain, field names, formulas, and validation rules from becoming project facts.

## Validation gate

Before downstream work proceeds, confirm that stakeholder groups/data needs, KPI intent, business terms, and project constraints are reviewed, and inspect the actual CSV source.
