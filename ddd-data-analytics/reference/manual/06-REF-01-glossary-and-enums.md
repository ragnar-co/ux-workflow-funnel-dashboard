---
title: Glossary และ Enumeration Registry
document_id: 06-REF-01-glossary-and-enums
version: 1.0.0
created_at: 2026-09-22
audience: all
owns: [enum-registry]
defers_to: [01-GOV-01-authority-truth-and-claims.md]
---

# Glossary และ Enumeration Registry

ตารางนี้คือดัชนี enum → เอกสารเจ้าของ ตรงกับ `agent_hints.input_context` ของ `business_glossary` ใน
`templates/ddd-data-analytics-v2.8.0.json` เอง (ไม่ใช่ "ตัวอย่างที่ดี" ใน `manual/analytics/
BUSINESS_GLOSSARY.md` ซึ่งเขียนก่อน v2.6.0 แยก 3 P-scale enum ออกจากกัน — ดู `02-CORE-01`)
**ไม่มีค่าจริงปรากฏในตารางนี้** (NB3) ค่าจริงอยู่ในเอกสารเจ้าของเท่านั้น คอลัมน์ "รูปร่าง" บอก
format/pattern ของค่า ไม่ใช่ค่า

## 【B|ทีมงาน】 Enumeration Registry

| `enum` | เอกสารเจ้าของ | รูปร่าง |
|---|---|---|
| `data_literacy_level` | STAKEHOLDERS.md | `low` / `medium` / `high` |
| `data_need_priority` | STAKEHOLDERS.md | `P0` (cannot operate without) / `P1` (important) / `P2` (nice to have) |
| `scd_type` | DATA_MODEL_SPEC.md | `1` (overwrite) / `2` (keep history) / `none` |
| `pdpa_classification` | DATA_MODEL_SPEC.md | `public` / `internal` / `confidential` / `restricted` |
| `rule_severity` | DATA_QUALITY.md | `error` (block pipeline) / `warning` (alert only) |
| `dataset_criticality` | SLA_FRESHNESS.md | `P0` (business-critical) / `P1`-`P2` (informational) — **คนละแกนจาก `data_need_priority`** |
| `chart_type` | VIZ_DESIGN_SPEC.md | project-defined string ตาม Chart Type Matrix (เช่น line, bar, donut, heatmap, KPI card) |
| `complexity_level` | VIZ_DESIGN_SPEC.md | `basic` / `intermediate` / `advanced` |
| `metric_status` | METRIC_SPEC.md | `draft` / `certified` / `deprecated` |
| `model_status` | AI_MODEL_SPEC.md | `Production` / `Staging` / `Experimental` / `Deprecated` |
| `work_item_status` | TASKS.md | `not started` / `in progress` / `done` |
| `incident_severity` | RUNBOOK.md | `SEV1` (critical) / `SEV2` (major) / `SEV3` (minor) — **ไม่ใช่ P-scale** |
| `change_type` | ANALYTICS_CHANGELOG.md | project-defined string ต่อประเภท change (metric definition / KPI target / pipeline / breaking) |

13 แถว ตรวจนับได้จาก `business_glossary`'s `agent_hints.input_context` ในตัว template โดยตรง
(ระบอบ 2 ใน `01-GOV-01` §12)

## 【B|ทีมงาน】 Format/ID convention อื่นที่ไม่ใช่ enum แต่เป็นสัญญา

| identifier | รูปแบบ | เจ้าของ |
|---|---|---|
| Metric ID | `metric_<snake_case_name>` | METRIC_SPEC.md |
| KPI ID (OKR mapping) | `O<n>: <objective text>` | KPI_DICTIONARY.md |
| dbt model name | `mart_<metric_name>` / `stg_<source>` / `int_<concept>` | METRIC_LOGIC.md |
| Contract ID | `dc-<project>-<domain>-v<n>` | DATA_CONTRACT.md |
| Task ID | `T-<NNN>` | TASKS.md |
| Incident ID | `INC-<YYYY>-<NNN>` | RUNBOOK.md |

## 【B|ทีมงาน】 คำศัพท์โดเมนของ TaskFlow ที่ BUSINESS_GLOSSARY.md เป็นเจ้าของนิยาม

ต่างจาก enum ระดับ template ด้านบน (ที่ทุกโปรเจกต์มี) ชุดนี้เป็นคำศัพท์เฉพาะโดเมนของเคส TaskFlow
เองที่ manual §4 แสดงเป็นตัวอย่างการเขียน BUSINESS_GLOSSARY.md ให้ testable — Active Customer, MRR,
Revenue, Churn Rate, Conversion — แต่ละคำมี `official_definition`, `common_misunderstanding` และ
`authoritative_source` ของตัวเอง (ดูตัวอย่างเต็มที่ `06-REF-02`) นี่คือรูปแบบที่ Term Definitions
section ของ BUSINESS_GLOSSARY.md ต้องทำ: นิยามที่ implement เป็น SQL ได้ทันที + common
misunderstanding + source พร้อม version/date ไม่ใช่ enum ของ template แต่เป็นคำที่แต่ละโปรเจกต์
ต้องนิยามเอง
