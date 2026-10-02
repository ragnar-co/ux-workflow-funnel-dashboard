# UX Flow

## Flow 1: Add NPS Result

User clicks `Add NPS Result`.

They choose one input method:

| Method | When to Use | Primary Action |
| --- | --- | --- |
| Manual Entry | Small amount of feedback or phone result | Add response |
| Upload File | CSV/XLSX export from Metasurvey, Blue, Notion, or spreadsheet | Upload file |
| Connect Survey Tool | Future API or webhook integration | Connect Metasurvey |

## Flow 2: Upload File

1. User uploads `.csv` or `.xlsx`
2. System previews first rows
3. System suggests column mapping
4. System warns about missing fields
5. System warns about duplicate responses
6. User fixes mapping
7. User clicks `Analyze File`
8. System shows analysis preview
9. User confirms import

Required fields:

- Customer or respondent name
- NPS score
- Comment
- Product or event
- Team or responsible owner
- Submitted date
- Source

## Flow 3: Auto Analysis

After upload/manual entry, system calculates:

- Overall NPS
- Promoters
- Passives
- Detractors
- Product performance
- Team performance
- Suggested responsible owner
- Root cause or comment theme
- Priority case

## Flow 4: Period Tags

System auto-tags by submitted date:

- Month tag, for example `Sep 2026`
- Quarter tag, for example `Q3/2026`
- Event tag, for example `Seminar Q3`

User can edit tags before confirming import.

## Flow 5: Response Center

Response Center is the operation page for follow-up cases.

Priority order:

1. SLA breached
2. Detractor
3. Need callback
4. Waiting owner
5. Resolved

Actions:

- Assign callback
- Add note
- Change status
- Add root cause
- Create action item
- Mark as resolved

## Flow 6: Report

Reports should be filterable by:

- Month
- Quarter
- Product
- Team
- Owner
- Source
- Event

Report outputs:

- Monthly NPS Summary
- Quarterly NPS Summary
- Product NPS Report
- Event NPS Report

