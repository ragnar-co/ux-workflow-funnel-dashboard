# VIZ_DESIGN_SPEC.md

## Chart Type Matrix

| User question | Visual | Reason |
| --- | --- | --- |
| Which workflow completes less often? | sortable workflow summary table with completion percentage | precise comparison across named workflows |
| How does the selected workflow progress? | ordered horizontal funnel/progression bars | preserves step sequence and makes volume loss visible |
| How much fails at each step? | values beside each step for drop-off count and rate | supports exact UX investigation evidence |
| Which step has the highest observed loss? | highlighted step summary/card | answers the primary prioritization question directly |

Avoid animation, multi-axis charts, and decorative custom chart behavior for the MVP.

## Color & Theme Spec

Reuse the supplied Ragnar NPS visual language only as a presentation reference:

- spacing, cards, navigation, typography hierarchy, form patterns, and design tokens may be adapted
- remove NPS-specific labels, colors-as-domain-meaning, and metric semantics
- do not rely on color alone to indicate highest drop-off or validation state

Project design tokens are available at `config/design-tokens.json`.

## Interaction Spec

Core interactions:

1. upload CSV
2. show validation result before analytics view is updated
3. optionally filter by `period_month` and `organization_id`
4. choose a `workflow_name`
5. render the selected workflow in ascending `step_order`
6. expose exact started/completed/drop-off values alongside the visual
7. visually and textually identify the highest-drop-off step

Changing a filter or workflow must recompute all displayed metrics from the same active filter scope.

## Accessibility Guidelines

- keyboard-accessible upload, filters, and workflow selector
- visible labels for all controls
- text equivalents for chart values
- do not encode pass/fail or highest-drop-off using color alone
- preserve readable contrast from the existing design reference; verify in the implemented theme
- funnel remains understandable when charts fail by retaining a tabular/value representation

## Data Literacy Guard Rails

The primary audience is a UX/UI analyst. The MVP should favor direct tables, percentages, counts, and ordered funnel bars.

Do not add animation or advanced multi-axis/custom visualizations. A high drop-off value is evidence for investigation, not proof of a UX cause.
