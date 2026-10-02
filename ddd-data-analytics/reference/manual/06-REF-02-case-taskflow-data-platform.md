---
title: เคสตัวอย่าง — TaskFlow Data Platform
document_id: 06-REF-02-case-taskflow-data-platform
version: 1.0.0
created_at: 2026-09-22
audience: all
owns: [case-taskflow]
defers_to: [01-GOV-01-authority-truth-and-claims.md]
---

# เคสตัวอย่าง — TaskFlow Data Platform

TaskFlow เป็น B2B project-management SaaS ที่แต่งขึ้นทั้งหมดเพื่อสอน — เหมือนกับเคสที่ใช้ใน
`examples/analytics/` และ `manual/analytics/`'s §4 ตัวเลขทุกตัวด้านล่างติดป้าย `[ILLUSTRATIVE]` ตาม
NB2/§4 ของ `01-GOV-01` **ห้ามอ้างเป็นค่ามาตรฐาน** — บริษัทสมมติเปิดให้บริการทีมขนาด 10-500 คน
`[ILLUSTRATIVE]`

## 【A|ผู้บริหาร】 Stakeholders และ Data Needs

**CEO — Marcus Lee** (Executive, data_literacy_level: medium) ต้องการ MRR growth rate WoW และ
% expansion revenue จาก upsell, preferred format: executive dashboard, decision_cadence: weekly ·
**Head of Customer Success — Aisha Patel** (data_literacy_level: high) ต้องการ churn signal
real-time · **Finance Controller — David Yoon** (data_literacy_level: medium) ต้องการ revenue
reconciliation รายเดือน · **VP of Operations — Sam Torres** (data_literacy_level: high) ต้องการ
pipeline health รายวัน

Data Needs Matrix: MRR = `data_need_priority` P0 สำหรับ CEO และ Finance (`P0` / weekly-monthly
`[ILLUSTRATIVE]`), Churn Rate = P0 สำหรับ Head of CS (`P0` / daily `[ILLUSTRATIVE]`)

## 【A|ผู้บริหาร】 KPI Catalog (KPI_DICTIONARY.md)

| KPI | Target `[ILLUSTRATIVE]` | Owner | Frequency |
|---|---|---|---|
| NRR (Net Revenue Retention) | `≥ 110%` `[ILLUSTRATIVE]` | VP of Revenue | Monthly |
| GRR (Gross Revenue Retention) | `≥ 90%` `[ILLUSTRATIVE]` | VP of Customer Success | Monthly |
| CAC Payback | `≤ 12 months` `[ILLUSTRATIVE]` | VP of Marketing | Quarterly |
| MRR | `≥ ฿500K (Q4)` `[ILLUSTRATIVE]` | VP of Revenue | Monthly |
| Churn Rate | `< 2%` `[ILLUSTRATIVE]` | VP of Customer Success | Monthly |

KPI Hierarchy: Company level (NRR, ARR, CAC Payback — parent: none) → Department level (GRR/Churn
Rate ใต้ Customer Success, parent: NRR) → Team level (Time-to-first-value `< 7 วัน`
`[ILLUSTRATIVE]`, Onboarding completion rate `≥ 85%` `[ILLUSTRATIVE]` ใต้ CS-Onboarding Team, parent:
GRR)

## 【C|วิศวกร】 Metric Spec ตัวเต็ม — MRR Churn Rate (METRIC_SPEC.md)

`parent_kpi: kpi_revenue_retention` · owner: Revenue Analytics Team · refresh_cadence: monthly
(1st of month, 08:00 UTC) · grain: `1 customer × 1 calendar month`

**Formula:** `(SUM(mrr_lost) / SUM(mrr_beginning_of_month)) * 100` — numerator = MRR จาก customer
ที่ cancel/downgrade ในเดือน, denominator = MRR ของ paid subscriptions ที่ active ณ วันที่ 1

**Action Thresholds:** warning `> 3.0%` `[ILLUSTRATIVE]` → Revenue Analytics Team รัน cohort
breakdown ภายใน 48 ชั่วโมง `[ILLUSTRATIVE]`; critical `> 5.0%` `[ILLUSTRATIVE]` → Customer Success
ติดต่อ top 20 at-risk accounts `[ILLUSTRATIVE]` ภายใน 24 ชั่วโมง `[ILLUSTRATIVE]` + escalate ไปยัง
VP of Revenue

## 【C|วิศวกร】 Data Model (DATA_MODEL_SPEC.md)

`fact_mrr_monthly` (grain: `1 customer × 1 calendar month`, source: Stripe Billing API) ·
`fact_usage_daily` (grain: `1 user × 1 calendar day`, source: TaskFlow Application Database) ·
`dim_customer` (SCD Type `2` — plan_tier เปลี่ยนได้, key_attributes: plan_tier
starter/pro/enterprise) · `dim_product` (SCD Type `1`)

**PDPA classification:** `dim_customer.email` = `confidential` (SHA-256 hash ใน analytics layer),
`dim_customer.company_name` = `internal`, `fact_usage_daily.user_id` = `confidential`
(pseudonymize), `dim_customer.region` = `public`

## 【C|วิศวกร】 Pipeline & Freshness (PIPELINE_SPEC.md, SLA_FRESHNESS.md)

Pipeline `mrr_transform`: source `staging.stg_subscriptions` (จาก `crm_extract`, Fivetran ทุก 6
ชั่วโมง `[ILLUSTRATIVE]`) → dbt model `mart_mrr_monthly` → destination `taskflow_dw.fact_mrr_monthly`
· schedule `0 2 * * *` (daily 02:00 UTC) · depends_on: `[crm_extract, dim_refresh]`

**Source Systems:** Zoho CRM (API pull ทุก 6 ชั่วโมง `[ILLUSTRATIVE]`), Product DB (CDC/Debezium
real-time), Stripe (webhook on-event), TaskFlow Web App event stream (streaming ingest — **ไม่ใช่
CDC**, `event_name` จาก TRACKING_PLAN.md)

**Freshness:** `fact_mrr_monthly` = `dataset_criticality` P0, refresh daily 06:00 UTC, delay
tolerance `2 hours` `[ILLUSTRATIVE]` (warning `> 1.5 hours` `[ILLUSTRATIVE]`, critical `> 2 hours`
`[ILLUSTRATIVE]`)

## 【D|Data-Governance】 Data Quality (DATA_QUALITY.md)

Null checks: `org_id`, `mrr_amount` = `error` severity, block pipeline · Range checks: `mrr_amount
>= 0`, `churn_rate BETWEEN 0 AND 1` = `error` · Anomaly: `churn_rate > 0.20` `[ILLUSTRATIVE]` =
warning; `MRR drop > 15% MoM` `[ILLUSTRATIVE]` = error, block pipeline · Completeness target:
`99.9%` `[ILLUSTRATIVE]` ของ rows มี required field ครบ

## 【D|Data-Governance】 Cost Governance (DATA_GOVERNANCE.md)

Monthly budget: BigQuery compute `฿45,000` `[ILLUSTRATIVE]`, storage `฿12,000` `[ILLUSTRATIVE]`,
Fivetran `฿25,000` `[ILLUSTRATIVE]`, รวม `฿82,000/เดือน` `[ILLUSTRATIVE]` (owner: Head of Data) —
คนละแกนจาก CONSTRAINTS.md's delivery budget ครั้งเดียว `฿1,200,000` `[ILLUSTRATIVE]` (go-live
2026-11-01 `[ILLUSTRATIVE]`) warning `≥ 70%` `[ILLUSTRATIVE]` ของ budget ก่อนวันที่ 20
`[ILLUSTRATIVE]` → alert; critical `≥ 90%` `[ILLUSTRATIVE]` → freeze non-essential scheduled queries
query guard rail: data_analyst `100 GB/query` `[ILLUSTRATIVE]`, auto-kill query ที่รันเกิน `10
นาที` `[ILLUSTRATIVE]`

## 【D|Data-Governance】 AI Model — Churn Prediction (AI_MODEL_SPEC.md)

Output: probability `0.0–1.0` ต่อ customer, business action: score `≥ 0.7` `[ILLUSTRATIVE]` → CSM
เพิ่มใน at-risk list ภายใน `24h` `[ILLUSTRATIVE]` — threshold link กับ METRIC_SPEC.md's
`churn_rate.warning_threshold = 0.20`

Evaluation: AUC-ROC `0.84` `[ILLUSTRATIVE]` (acceptance `≥ 0.80` `[ILLUSTRATIVE]`, retrain trigger
`< 0.75` `[ILLUSTRATIVE]`) · Training: 24 เดือนย้อนหลัง, time-based split `70/15/15`
`[ILLUSTRATIVE]` (ไม่ใช่ random) · Model drift: KS-statistic `> 0.1` `[ILLUSTRATIVE]` ต่อ feature →
alert

## 【A|ผู้บริหาร】 Dashboard & Report Coverage

CEO Executive Dashboard (v2.1, Zoho Analytics, refresh daily `06:30` `[ILLUSTRATIVE]`) แสดง MRR,
Churn Rate, NRR, CAC Payback — Metric Coverage Matrix: ทุก P0 KPI มี dashboard รองรับอย่างน้อย 1 อัน
(ไม่มี missing coverage) Weekly Business Review Report ส่งทุกวันจันทร์ `08:00` `[ILLUSTRATIVE]`
deadline data ready `07:30` `[ILLUSTRATIVE]` ถึง CEO, VP Sales, VP CS

## 【B|ทีมงาน】 Business Glossary — Term ตัวอย่าง

**MRR:** "(ราคา plan รายเดือน × จำนวน active subscriptions) สำหรับ annual contract หาร annual value
ด้วย 12" — common misunderstanding: หลายคนคิดว่า annual contract MRR เป็น 0 ใน 11 เดือนแล้วรับรู้
ทั้งหมดในเดือนต่ออายุ — authoritative source: Finance Team, Revenue Recognition Policy FY2025
(ปรับตาม IFRS 15) **Disputed term — Churn Rate:** Finance นับเฉพาะ official cancellation, Product
เคยนับรวม inactive >60 วันด้วย — resolution: ใช้ definition ของ Finance เท่านั้น, inactive แยกเป็น
metric "Dormant Rate" ต่างหาก approved 10 มกราคม 2025 `[ILLUSTRATIVE]` โดย VP of Product ร่วมกับ Head
of Finance
