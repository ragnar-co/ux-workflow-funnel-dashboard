---
title: Readiness Gates — 6 gate เต็ม 34 item
document_id: 05-PRACTICE-02-checklists-gates-and-validation
version: 1.0.0
created_at: 2026-09-22
audience: all
owns: [readiness-gate-walkthrough]
defers_to: [04-SPEC-01-doc-map.md]
---

# Readiness Gates — 6 gate เต็ม 34 item

คัดลอกจาก `deliverables.readiness_gates` ของ `ddd-data-analytics-v2.8.0.json` ตรงๆ ทุก item มี
`refs[]` ชี้กลับไปยังเอกสารที่ตรวจ — ถ้า repo ต่ออยู่ (ระบอบ 2) ให้ยืนยันจำนวนกับ JSON จริงก่อนอ้างว่า
ครบ ไฟล์นี้แสดงทั้ง 34 item เต็มคำต่อคำ (track นี้มี 6 gate ไม่ใช่ 5 เหมือน web-app/ai-workflow —
โดยตั้งใจ ดู `04-SPEC-01`)

## 【C|วิศวกร】 data_quality_readiness (4 item)

1. Null rate for required fields stays within the calibrated threshold defined in DATA_QUALITY.md
   across all pipelines (refs: data_quality)
2. Range checks pass on all fact tables with no invalid values (refs: data_quality)
3. Anomaly detection rules active and alerting correctly (refs: data_quality)
4. Referential integrity passes for all foreign key relationships (refs: data_model_spec)

## 【C|วิศวกร】 pipeline_readiness (5 item)

1. All pipelines complete one full cycle without errors (refs: pipeline_spec)
2. Freshness SLA met for all datasets per SLA_FRESHNESS.md (refs: sla_freshness)
3. Error handling and retry tested with failure scenarios (refs: pipeline_spec)
4. Metric values cross-checked between pipeline output and METRIC_SPEC.md formulas (refs:
   metric_spec, metric_logic)
5. Data contracts signed off between Product and Data teams (refs: data_contract)

## 【D|Data-Governance】 governance_readiness (5 item)

1. Every dataset has a named Data Owner and Data Steward (refs: data_governance)
2. PDPA/PII classification complete for every column in DATA_MODEL_SPEC.md (refs: data_governance,
   data_model_spec)
3. Access control policy implemented and tested (refs: data_governance)
4. Lineage traces complete for all metrics from source to dashboard (refs: lineage)
5. **"BUSINESS_GLOSSARY.md Enumeration Registry covers every enum actually used, each with exactly
   one owner — no enum redeclared outside its owner document"** (refs: business_glossary) —
   ตัวอย่างรูปแบบ gate ที่ตรวจ NB3 ใน `01-GOV-01` เป็น gate item ตัวจริง ไม่ใช่แค่กฎการสอน

## 【C|วิศวกร】 testing_readiness (4 item)

1. dbt schema tests (not_null, unique, accepted_values) pass on all models (refs: testing_strategy)
2. Integration tests complete a full pipeline cycle successfully (refs: testing_strategy,
   pipeline_spec)
3. Metric validation tests cross-check values against golden dataset (refs: testing_strategy,
   metric_logic)
4. CI/CD pipeline blocks deployment when tests fail (refs: testing_strategy)

## 【D|Data-Governance】 operational_readiness (7 item)

1. Runbook reviewed by on-call team covering all failure scenarios (refs: runbook)
2. Escalation contacts updated and verified reachable (refs: runbook)
3. Post-incident review template ready for use (refs: runbook)
4. Analytics Changelog initialized with process for recording changes (refs: analytics_changelog)
5. Cost monitoring dashboard live with alert thresholds; retention purge jobs scheduled per the
   runbook (refs: data_governance, runbook)
6. **"Every value left null during drafting — metric action threshold, data-contract SLA figure,
   quality threshold, anomaly bound, freshness tolerance, test coverage expectation, retention
   period, cost ceiling, model acceptance, drift threshold, scale projection, and project budget —
   now has a real value with its source; null is a drafting state, never a go-live state"** (refs:
   metric_spec, data_contract, data_quality, sla_freshness, testing_strategy, data_governance,
   ai_model_spec, constraints) — นี่คือ NB1 ใน `01-GOV-01` เขียนเป็น gate item ตัวจริง ครอบคลุมทุก
   ค่าที่ template อนุญาตให้เป็น `null` ตอนร่าง
7. CONSTRAINTS.md, AGENTS.md, TASKS.md, and README.md all present — every forbidden pattern in
   AGENTS.md pairs its prohibition with the correct alternative in the same entry, none bare (refs:
   constraints, agents_md, tasks, readme)

## 【A|ผู้บริหาร】 business_readiness (9 item)

1. All stakeholder groups identified and their data needs approved (refs: stakeholders)
2. KPI Dictionary approved by CEO and business stakeholders (refs: kpi_dictionary)
3. Business Glossary reviewed and agreed upon by all teams (refs: business_glossary)
4. Dashboard sign-off from target users (CEO, CSM, Finance) (refs: dashboard_spec)
5. Data consumers understand metric definitions and action thresholds (refs: metric_spec)
6. Scheduled reports delivered to all recipients per distribution list (refs: report_spec)
7. AI/ML models pass evaluation metrics per acceptance thresholds (refs: ai_model_spec)
8. Chart type for every dashboard chart matches viz_design_spec.chart_type_matrix (refs:
   viz_design_spec, dashboard_spec)
9. **"Visualization complexity never exceeds the audience's data_literacy_level — intermediate
   charts (heatmap, scatter, crosshair) only for intermediate or above, animated, multi-axis and
   custom charts only for advanced"** (refs: viz_design_spec, stakeholders) — ตัวเลข/ระดับตรงนี้คือ
   ค่าที่ต้องไม่ขัดกับ `02-CORE-02`/`03-PHASE-04` (ดู regression guard เรื่อง animation ที่
   `01-GOV-01` §7)
