# Deployment Guide

The safest first version should be a static frontend app.

## Recommended First Build

Use one of these:

- Plain Vite + React
- Plain Vite + Vanilla JS
- Next.js static export only if needed

Recommended for easiest deploy:

```text
Vite + React + local JSON/CSV mock data
```

This avoids backend and database setup at the prototype stage.

## Why Static First

Static first is safer because:

- No server runtime issue
- No database migration issue
- Easy to deploy on Vercel, Netlify, Cloudflare Pages, GitHub Pages, or internal static hosting
- Easy to handoff to Claude Code
- Upload analysis can be mocked client-side first

## Avoid for First Version

Avoid adding these too early:

- Authentication
- Database
- Serverless upload storage
- Heavy chart framework
- PDF generator
- Complex API integration

Add them after the UX is approved.

## Build Checklist

Before deploy:

- App runs with `npm install`
- App runs with `npm run dev`
- App builds with `npm run build`
- No local absolute paths
- No hidden dependency on uploaded screenshots
- Fonts loaded from `/public/fonts`
- Mock data stored in `/src/data` or `/public/data`
- Config stored in `/src/config`
- No API keys committed
- Upload flow works with sample CSV
- Empty states are visible
- Error states are visible

## Production Font

Add LINE Seed Sans Thai into:

```text
public/fonts/LINESeedSansTH/
```

Then define:

```css
@font-face {
  font-family: "LINE Seed Sans Thai";
  src: url("/fonts/LINESeedSansTH/LINESeedSansTH_W_Rg.woff2") format("woff2");
  font-weight: 400;
}
```

## Suggested Deploy Phases

### Phase 1: Static Prototype

- Dashboard
- Response Center
- Upload preview with sample CSV
- Config-driven products and teams

### Phase 2: Internal MVP

- Real CSV/XLSX parser
- Confirm import
- Local or backend persistence
- Role-based navigation

### Phase 3: Operational System

- Metasurvey connection
- Blue board / Notion import
- Authentication
- Owner assignment
- Report export

