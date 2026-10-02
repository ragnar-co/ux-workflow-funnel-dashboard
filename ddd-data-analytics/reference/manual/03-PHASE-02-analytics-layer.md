---
title: Analytics Layer — How We Compute (3 เอกสาร)
document_id: 03-PHASE-02-analytics-layer
version: 1.0.0
created_at: 2026-09-22
audience: all
owns: [phase-analytics-howto]
defers_to: [02-CORE-01-what-this-template-is.md, 04-SPEC-01-doc-map.md]
---

# Analytics Layer — How We Compute

ลำดับผลิต: `data_model_spec` → `metric_logic` → `data_contract` (data_model_spec ต้องรอ metric_spec
เท่านั้น, metric_logic ต้องรอทั้ง metric_spec และ data_model_spec, data_contract ต้องรอ
data_model_spec)

## 【C|วิศวกร】 data_model_spec — DATA_MODEL_SPEC.md (depends_on: [metric_spec])

ห้าหัวข้อบังคับ: Fact Tables, Dimension Tables, Relationships, Grain Definitions, PDPA Data
Classification — เอกสารนี้คือ **hub ใหญ่ที่สุดของทั้ง template** (8 downstream: metric_logic,
data_contract, pipeline_spec, data_quality, dashboard_spec, data_governance, lineage,
ai_model_spec) เขียนผิดที่นี่กระทบเป็นลูกโซ่ทั้ง 8 ฉบับ — fact table ใช้ prefix `fact_`, dimension
table ใช้ prefix `dim_`, PK แยกจาก business key เสมอ SCD Type ของทุก dimension table ต้องระบุ (1 =
overwrite, 2 = เก็บ history ด้วย valid_from/valid_to, none = ไม่เปลี่ยน) — ถ้าไม่แน่ใจใช้ Type 2
เป็น default เพราะเก็บ history ไว้ก่อนดีกว่าทำข้อมูลหาย **PDPA Data Classification ต้องครบทุก
column** ที่มี personal data (4 ระดับ: public/internal/confidential/restricted) — เอกสารนี้เป็น
เจ้าของ `scd_type` และ `pdpa_classification` enum ทั้งคู่

## 【C|วิศวกร】 metric_logic — METRIC_LOGIC.md (depends_on: [metric_spec, data_model_spec])

สามหัวข้อบังคับ: Metric SQL Implementations, Edge Case Handling, Transformation Dependencies —
เอกสารนี้คือ**สะพาน**ระหว่าง business definition (METRIC_SPEC "วัดอะไร") กับ technical
implementation ("คำนวณอย่างไรใน SQL") `metric_id` ต้องตรงกับ id ใน METRIC_SPEC.md ทุกประการ,
`group_by_grain` ต้องตรงกับ `grain` ที่ METRIC_SPEC.md ประกาศ — **Edge Case Handling ต้องมีครบ 5
ประเภท**: mid-month churn (prorate หรือนับเต็มเดือน — ตกลงกับ Finance), proration บน plan change,
null/missing values, currency conversion (ถ้ามี multi-currency), backdated records (late-arriving
data + restatement policy) ทุก edge case ต้องมี SQL logic จริงที่ copy ไปใช้ได้ ไม่ใช่แค่คำอธิบาย
ภาษาธุรกิจ — Transformation Dependencies ต้องมี Mermaid DAG ครบ 3 layer: staging → intermediate →
mart พร้อม materialization strategy ต่อ model (view/table/incremental) **AGENTS.md's กฎที่หนักแน่น
ที่สุดผูกกับเอกสารนี้โดยตรง:** สูตร metric ที่แท้จริงมีที่เดียวคือ METRIC_LOGIC.md — dashboard หรือ
model ใดคำนวณ metric เดียวกันด้วยสูตรของตัวเอง คือข้อบกพร่อง ไม่ใช่ทางลัด

## 【D|Data-Governance】 data_contract — DATA_CONTRACT.md (depends_on: [data_model_spec])

เจ็ดหัวข้อบังคับ: Contract Overview, Schema Definitions, SLA Commitments, Breaking Change Policy,
Required Fields, Data Type Constraints, Upstream Event Contract (Product Events) — เจ็ดหัวข้อ
เพราะเพิ่ม Upstream Event Contract สำหรับ event-sourced pipeline เข้ามา **Breaking ≠ Additive** คือ
เส้นแบ่งที่ต้องประกาศไว้ก่อน ไม่ใช่ถกกันตอน producer แจ้งล่วงหน้า 3 วัน: เพิ่ม nullable field = additive
(ไม่พัง consumer เดิม); เปลี่ยน type, ลบ field, เปลี่ยนความหมาย, หรือแคบ enum ลง = breaking
(ต้องผ่าน notice period ≥14 วัน) monetary field ต้องใช้ `DECIMAL` เสมอ ห้าม `FLOAT` (rounding error)

**Upstream Event Contract ปิดช่องว่างของ TRACKING_PLAN.md** — TRACKING_PLAN.md ของ web-app **ไม่มี
schema_version ของตัวเอง** เอกสารนี้จึงเป็นที่เดียวที่ event ที่รับเข้ามาได้เวอร์ชันจริง: อ้างชื่อ
event จาก `event_name` enum ที่ TRACKING_PLAN.md เป็นเจ้าของ (ห้าม list ค่าซ้ำ), ทำตาราง mapping
`event_name → contract_version → first consumed run`, และระบุกลไกตรวจจับ schema drift (อยู่ที่
DATA_QUALITY.md หรือ PIPELINE_SPEC.md เพราะต้นทางไม่ส่ง version มาเอง) — ดู Optional Integrations
ที่ `02-CORE-01`
