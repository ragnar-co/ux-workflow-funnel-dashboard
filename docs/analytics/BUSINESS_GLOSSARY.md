# BUSINESS_GLOSSARY.md

## Term Definitions

### Workflow

A named user journey/process represented by `workflow_name` and composed of ordered steps.

### Step

A position within a workflow identified by positive integer `step_order` and labeled by `step_name`.

### Started Count

The source-provided aggregate count in `started_count` for entries starting a workflow step at the source grain. The CSV contains no identifier that proves these are unique users.

### Completed Count

The source-provided aggregate count in `completed_count` for entries completing a workflow step at the source grain. In the supplied file, each next-step `started_count` equals the previous-step `completed_count` within every observed organization-month-workflow sequence.

### Workflow Completion Performance

End-to-end completion measured from first-step starts to final-step completions within the active filter scope. Exact formula is owned by `METRIC_SPEC.md`.

### Drop-off

Observed loss inside a step: started count minus completed count. Exact ratio logic is owned by `METRIC_SPEC.md`.

### Highest-drop-off Step

The step selected by the project metric as having the maximum observed `step_dropoff_rate` within the chosen workflow and filter scope. It is an investigation target, not a proven UX root cause.

### UX Investigation Brief

An optional saved draft that references observed workflow/step analysis and proposes hypotheses and usability-testing questions. AI-generated hypotheses are not observations or confirmed causes.

## Disputed Terms

- `user`: the assignment wording may say user, but the supplied CSV has no user/session identifier; dashboard copy should prefer aggregate count/attempt wording unless source ownership confirms unique-user semantics
- `drop-off`: use the project metric definition only; do not substitute a separate product/event definition

## Change Log

| Date | Change | Source |
| --- | --- | --- |
| 2026-10-02 | Initial glossary | assignment + user decisions |
| 2026-10-02 | Updated terms after inspection of the actual assignment CSV | `data/raw/numnim_ux_funnel_mock.csv` |

## Enumeration Registry

No project enumeration values are declared here.

When enums are introduced, list enum name -> canonical owner document only. Do not duplicate enum values here.
