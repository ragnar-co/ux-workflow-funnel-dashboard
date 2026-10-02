# CONSTRAINTS.md

## Platform & Tooling Constraints

- DDD track: `ddd-data-analytics`
- Database: `DuckDB`
- Development assistance: Claude Code/Codex
- Deployment target: Coolify
- Source control target: company repository
- Existing Ragnar NPS project is a UX/UI reference, not analytics-domain source of truth
- Application framework: not yet fixed; choose the lightest option compatible with the 120-minute delivery window and Coolify

## Scale Constraints

Observed source size for the supplied assignment file:

- 21,600 rows
- 200 organizations
- 9 months
- 4 workflows

Future scale projection: `null`

Calibration owner: Engineering / Delivery Owner.

## Compliance & Residency Constraints

- formal PDPA classification: `null`
- residency requirement: not supplied
- no user/session identifier exists in the current CSV
- calibration owner for formal classification: Data Governance / assignment owner

## Project Budget & Timeline

- delivery window: 120 minutes
- additional token purchase/top-up: not allowed
- monetary project budget: `null`
- calibration owner for monetary budget: assignment owner / project sponsor

## Integration Constraints

- CSV is the required source input
- the supplied source file is `data/raw/numnim_ux_funnel_mock.csv`
- data must pass validation before becoming the active analytics dataset
- persist analytics data in DuckDB
- Coolify deployment must produce a usable application
- company repository push is required
- optional AI may use only the company-provided endpoint/quota; endpoint contract is not supplied
