# Editing Guide

This project should be easy for a UX/UI or product owner to adjust without touching deep logic.

## What Should Be Easy to Edit

Keep these in config or data files:

- Product list
- Team list
- Navigation labels
- Source list
- NPS segment labels
- Case statuses
- Button copy
- Monthly / quarterly period labels
- CSV upload column names
- Theme colors

Recommended editable files:

- `config/app-config.json`
- `config/design-tokens.json`
- `data/nps-import-template.csv`

## What Should Not Be Hardcoded

Avoid hardcoding these directly inside components:

- Product names
- Team names
- Owner names
- Survey source names
- Thai copy
- Month or quarter text
- Status labels

## Suggested Folder Structure for Claude Code

```text
ragnar-nps/
  public/
    fonts/
      LINESeedSansTH/
    assets/
      previews/
  src/
    app/
      App.tsx
      routes.tsx
    config/
      app-config.json
      design-tokens.json
    domain/
      nps/
      intake/
      follow-up/
      reporting/
    data/
      mock-responses.csv
    components/
      layout/
      cards/
      charts/
      table/
      upload/
    pages/
      DashboardPage.tsx
      AddResultPage.tsx
      ValidateImportPage.tsx
      ResponseCenterPage.tsx
      ProductTeamPage.tsx
      EventNpsPage.tsx
      ReportsPage.tsx
```

## Recommended Editing Pattern

Use JSON config for things that the user may edit later.

Example:

```js
import config from "./config/app-config.json";

config.products.map((product) => product.name);
```

## For Non-Developer Edits

If this becomes an internal tool, expose these as admin settings later:

- Add product
- Add team
- Add responsible owner
- Add source
- Rename status
- Edit SLA rule

