---
title: แผนที่เอกสาร 23 ฉบับของ ddd-data-analytics
document_id: 04-SPEC-01-doc-map
version: 1.0.0
created_at: 2026-09-22
audience: all
owns: [doc-card-23, generation-order-verbatim, suggested-headings-verbatim, dependency-gap-protocol]
defers_to: [01-GOV-01-authority-truth-and-claims.md, 06-REF-01-glossary-and-enums.md]
---

# แผนที่เอกสาร 23 ฉบับของ ddd-data-analytics

⚠ ไฟล์นี้เป็น **spec card ย่อจาก template JSON จริง** ไม่ใช่ตัวแทนของ manual เต็ม ใช้เป็นจุดเริ่มก่อน
เขียนเอกสารจริง ถ้า repo `ddd` ต่ออยู่ (ระบอบ 2 ใน `01-GOV-01` §12)
`templates/ddd-data-analytics-v2.8.0.json` ชนะการ์ดนี้เมื่อขัดกัน — ต้องยืนยัน `depends_on` และ
headings กับ JSON จริงก่อนลงมือ

## 【B|ทีมงาน】 Track Header

| field | value |
|---|---|
| template_file | `ddd-data-analytics-v2.8.0.json` |
| `meta.version` | 2.8.0 (แชร์กับ `ddd-web-app-v2.8.0.json`) |
| domain | `data_analytics` |
| จำนวนเอกสาร | 23 ฉบับ |
| phases | 5 phase — Business Layer (5) · Analytics Layer (3) · Data Engineering Layer (4) · Analytics Output Layer (3) · Governance & AI Layer (8) |
| readiness gates | 6 gate / 34 checklist item รวม |
| manual_dir | `manual/analytics/` (23 ไฟล์) |
| examples_dir | `examples/analytics/` (3 ไฟล์ — KPI_DICTIONARY, METRIC_SPEC, DASHBOARD_SPEC) |
| `output_dir` | `docs/data-analytics/` |

### `meta.generation_order` — 23 ตัว เรียงตามลำดับจริง verbatim

```text
1. stakeholders → STAKEHOLDERS.md P1 depends_on: []
2. constraints → CONSTRAINTS.md P0 depends_on: []
3. kpi_dictionary → KPI_DICTIONARY.md P0 depends_on: []
4. business_glossary → BUSINESS_GLOSSARY.md P0 depends_on: []
5. metric_spec → METRIC_SPEC.md P0 depends_on: [kpi_dictionary, business_glossary, stakeholders]
6. data_model_spec → DATA_MODEL_SPEC.md P0 depends_on: [metric_spec]
7. metric_logic → METRIC_LOGIC.md P0 depends_on: [metric_spec, data_model_spec]
8. data_contract → DATA_CONTRACT.md P1 depends_on: [data_model_spec]
9. pipeline_spec → PIPELINE_SPEC.md P0 depends_on: [data_model_spec, metric_logic]
10. data_quality → DATA_QUALITY.md P0 depends_on: [data_model_spec, pipeline_spec]
11. sla_freshness → SLA_FRESHNESS.md P1 depends_on: [pipeline_spec]
12. testing_strategy → TESTING_STRATEGY.md P1 depends_on: [pipeline_spec, data_quality, metric_logic]
13. viz_design_spec → VIZ_DESIGN_SPEC.md P1 depends_on: [stakeholders, metric_spec]
14. dashboard_spec → DASHBOARD_SPEC.md P0 depends_on: [metric_spec, kpi_dictionary, data_model_spec, stakeholders, testing_strategy, viz_design_spec]
15. report_spec → REPORT_SPEC.md P1 depends_on: [dashboard_spec, kpi_dictionary, metric_spec, stakeholders, sla_freshness]
16. data_governance → DATA_GOVERNANCE.md P0 depends_on: [data_model_spec, data_contract, kpi_dictionary]
17. agents_md → AGENTS.md P0 depends_on: [pipeline_spec, data_governance, constraints, data_model_spec]
18. tasks → TASKS.md P0 depends_on: [kpi_dictionary, pipeline_spec]
19. lineage → LINEAGE.md P1 depends_on: [metric_logic, pipeline_spec, data_model_spec, dashboard_spec]
20. ai_model_spec → AI_MODEL_SPEC.md P2 depends_on: [data_model_spec, metric_spec, data_quality, lineage]
21. runbook → RUNBOOK.md P0 depends_on: [pipeline_spec, sla_freshness, data_quality]
22. analytics_changelog → ANALYTICS_CHANGELOG.md P1 depends_on: [metric_spec, kpi_dictionary, pipeline_spec, data_contract]
23. readme → README.md P0 depends_on: [stakeholders, pipeline_spec, runbook, testing_strategy]
```

## 【B|ทีมงาน】 Doc Cards — suggested_headings verbatim ต่อเอกสาร

การ์ดด้านล่างคัดลอก `output_format.suggested_headings` ของแต่ละเอกสารตรงๆ จาก template — ห้ามแต่งเพิ่ม
ห้ามตัดออก

**1. stakeholders → STAKEHOLDERS.md** (P1, depends_on: none)
Stakeholder Profiles · Data Needs Matrix

**2. constraints → CONSTRAINTS.md** (P0, depends_on: none)
Platform & Tooling Constraints · Scale Constraints · Compliance & Residency Constraints ·
Project Budget & Timeline · Integration Constraints

**3. kpi_dictionary → KPI_DICTIONARY.md** (P0, depends_on: none)
KPI Catalog · KPI Hierarchy (CEO to Team Level) · Measurement Frequency · KPI Owners

**4. business_glossary → BUSINESS_GLOSSARY.md** (P0, depends_on: none)
Term Definitions · Disputed Terms · Change Log · Enumeration Registry

**5. metric_spec → METRIC_SPEC.md** (P0, depends_on: kpi_dictionary, business_glossary,
stakeholders)
Metric Profiles · Formula Reference · Grain and Filter Matrix · Action Thresholds

**6. data_model_spec → DATA_MODEL_SPEC.md** (P0, depends_on: metric_spec)
Fact Tables · Dimension Tables · Relationships · Grain Definitions · PDPA Data Classification

**7. metric_logic → METRIC_LOGIC.md** (P0, depends_on: metric_spec, data_model_spec)
Metric SQL Implementations · Edge Case Handling · Transformation Dependencies

**8. data_contract → DATA_CONTRACT.md** (P1, depends_on: data_model_spec)
Contract Overview · Schema Definitions · SLA Commitments · Breaking Change Policy ·
Required Fields · Data Type Constraints · Upstream Event Contract (Product Events)

**9. pipeline_spec → PIPELINE_SPEC.md** (P0, depends_on: data_model_spec, metric_logic)
Pipeline Overview · Pipeline Definitions · Source Systems · Error Handling and Retry ·
Credentials & Secret Management · Load Strategy

**10. data_quality → DATA_QUALITY.md** (P0, depends_on: data_model_spec, pipeline_spec)
Null and Completeness Checks · Range and Validity Checks · Referential Integrity Checks ·
Anomaly Detection Rules · Quality Dashboards

**11. sla_freshness → SLA_FRESHNESS.md** (P1, depends_on: pipeline_spec)
Freshness Requirements per Dataset · Delay Tolerance Matrix · Alert Rules ·
Escalation Procedures

**12. testing_strategy → TESTING_STRATEGY.md** (P1, depends_on: pipeline_spec, data_quality,
metric_logic)
Unit Tests (dbt / SQL) · Integration Tests · Metric Validation Tests ·
Dashboard Acceptance Tests · Test Automation and CI

**13. viz_design_spec → VIZ_DESIGN_SPEC.md** (P1, depends_on: stakeholders, metric_spec)
Chart Type Matrix · Color & Theme Spec · Interaction Spec · Accessibility Guidelines ·
Data Literacy Guard Rails

**14. dashboard_spec → DASHBOARD_SPEC.md** (P0, depends_on: metric_spec, kpi_dictionary,
data_model_spec, stakeholders, testing_strategy, viz_design_spec)
Dashboard Inventory · Dashboard Profiles · Metric Coverage Matrix · Drill-down Logic ·
Refresh Schedule

**15. report_spec → REPORT_SPEC.md** (P1, depends_on: dashboard_spec, kpi_dictionary, metric_spec,
stakeholders, sla_freshness)
Report Profiles · KPI Coverage · Distribution Schedule · Template Definitions

**16. data_governance → DATA_GOVERNANCE.md** (P0, depends_on: data_model_spec, data_contract,
kpi_dictionary)
Data Ownership Matrix · Access Control Policy · PDPA and PII Classification ·
Data Retention Policy · Audit Requirements · Cost Governance

**17. agents_md → AGENTS.md** (P0, depends_on: pipeline_spec, data_governance, constraints,
data_model_spec)
Project Overview · Tech Stack · Query & Modeling Conventions · Forbidden Patterns ·
Data Quality & Testing Rules · PDPA Rules

**18. tasks → TASKS.md** (P0, depends_on: kpi_dictionary, pipeline_spec)
Task Breakdown · Task Sequence and Dependencies · Definition of Done ·
Assignments and Estimates

**19. lineage → LINEAGE.md** (P1, depends_on: metric_logic, pipeline_spec, data_model_spec,
dashboard_spec)
Metric-to-Source Traces · Table-level Lineage · Impact Analysis Matrix · Breaking Change Impact

**20. ai_model_spec → AI_MODEL_SPEC.md** (P2, depends_on: data_model_spec, metric_spec,
data_quality, lineage)
Model Inventory · Model Profiles · Feature Definitions · Training Data Spec ·
Evaluation Metrics · Deployment and Monitoring

**21. runbook → RUNBOOK.md** (P0, depends_on: pipeline_spec, sla_freshness, data_quality)
Common Failure Scenarios · Triage Checklist · Recovery Procedures · Escalation Contacts ·
Post-Incident Review · Retention Enforcement & Archival

**22. analytics_changelog → ANALYTICS_CHANGELOG.md** (P1, depends_on: metric_spec, kpi_dictionary,
pipeline_spec, data_contract)
Metric Definition Changes · KPI Target Changes · Pipeline Changes · Breaking Changes Log

**23. readme → README.md** (P0, depends_on: stakeholders, pipeline_spec, runbook,
testing_strategy)
Project Name and Description · Quick Start · Prerequisites · Installation · Usage ·
Architecture Overview · Contributing · License

## 【B|ทีมงาน】 Readiness Gates — 6 gate / 34 item

| Gate | จำนวน item | เจ้าของหลัก (refs[]) |
|---|---|---|
| `data_quality_readiness` | 4 | data_quality, data_model_spec |
| `pipeline_readiness` | 5 | pipeline_spec, sla_freshness, metric_spec, metric_logic, data_contract |
| `governance_readiness` | 5 | data_governance, data_model_spec, lineage, business_glossary |
| `testing_readiness` | 4 | testing_strategy, pipeline_spec, metric_logic |
| `operational_readiness` | 7 | runbook, analytics_changelog, data_governance, constraints, agents_md, tasks, readme, metric_spec, data_contract, data_quality, sla_freshness, testing_strategy, ai_model_spec |
| `business_readiness` | 9 | stakeholders, kpi_dictionary, business_glossary, dashboard_spec, metric_spec, report_spec, ai_model_spec, viz_design_spec |

6 gate ไม่ใช่ 5 (ไม่เหมือน web-app/ai-workflow ที่ 5/5) — **โดยตั้งใจ**: sign-off เชิงธุรกิจต่อ metric
definition ไม่มี equivalent ใน track อื่น รายละเอียด item-by-item อยู่ที่
`05-PRACTICE-02-checklists-gates-and-validation.md`

## 【C|วิศวกร】 Production Protocol — ก่อนผลิตเอกสารจริง

เมื่อถูกขอให้ผลิตเอกสารฉบับหนึ่งจริง (ไม่ใช่แค่สอน) ให้ทำตามลำดับนี้เสมอ **ห้ามข้าม**:

1. ระบุ target doc id จากตาราง generation_order ด้านบน
2. เปิด Doc Card ของ doc นั้นเพื่อดู headings บังคับ
3. ตรวจ `depends_on` ของ doc นั้น
4. **ถ้า upstream document ที่ `depends_on` ระบุยังไม่มีอยู่จริง (ผู้ใช้ยังไม่ได้เขียนหรือให้เนื้อหา
   มา) — หยุดการผลิต target document ทันที** รายงานว่า dependency ตัวไหนขาด ห้ามผลิตต่อโดยสมมติเนื้อหา
   ของ upstream document ขึ้นมาเอง และห้ามใช้เนื้อหาตัวอย่าง TaskFlow เป็นข้อเท็จจริงของโปรเจกต์
   ผู้ใช้
5. ถ้า dependency ครบ ให้เขียนจากเอกสารเจ้าของ + โครงสร้าง headings ของ template เท่านั้น
6. หลังเขียนเสร็จ ตรวจว่าทุก heading บังคับมีครบ และทุก cross-reference resolve ไปยัง doc id ที่มีจริง

**พฤติกรรมเมื่อ dependency ขาดคือ STOP เสมอ ไม่ใช่ "เขียนไปก่อนแล้วเติมทีหลัง"** — การเขียน
METRIC_LOGIC.md โดยไม่มี DATA_MODEL_SPEC.md ที่แท้จริง หมายความว่าไม่มี fact/dimension table ให้ผูก
SQL ด้วย ผลลัพธ์คือเอกสารที่ "ดูครบ" แต่ query ไม่มี table จริงรองรับเลย
