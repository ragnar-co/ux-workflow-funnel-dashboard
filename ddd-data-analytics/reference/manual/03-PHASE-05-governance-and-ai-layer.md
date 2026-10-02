---
title: Governance & AI Layer (8 เอกสาร)
document_id: 03-PHASE-05-governance-and-ai-layer
version: 1.0.0
created_at: 2026-09-22
audience: all
owns: [phase-governance-howto]
defers_to: [02-CORE-01-what-this-template-is.md, 04-SPEC-01-doc-map.md]
---

# Governance & AI Layer

ลำดับผลิต: `data_governance` → `agents_md` → `tasks` → `lineage` → `ai_model_spec` → `runbook` →
`analytics_changelog` → `readme` (readme generate ท้ายสุดในทุก template เพราะต้องอ้างเอกสารเกือบ
ทั้งหมด)

## 【D|Data-Governance】 data_governance — DATA_GOVERNANCE.md (depends_on: [data_model_spec, data_contract, kpi_dictionary])

หกหัวข้อบังคับ: Data Ownership Matrix, Access Control Policy, PDPA and PII Classification, Data
Retention Policy, Audit Requirements, Cost Governance — เอกสารนี้คือ "รัฐธรรมนูญ" ของ data ที่ทุกทีม
ต้องปฏิบัติตาม ทุก dataset ต้องมี Data Owner + Data Steward เป็น**ชื่อจริง** ไม่ใช่แค่ชื่อทีม

**Access control ที่บังคับใช้แค่ชั้น BI tool คือประตูที่ล็อกข้างเดียว** — ใครก็ตามที่ query
warehouse ตรงจะข้ามไปทั้งหมด ต้องมี row-level security (บังคับที่ชั้นไหน) และ column masking (ตาม
`pdpa_classification`) ด้วย PDPA Classification มี 4 ระดับ: restricted (direct identifier),
confidential (indirect identifier), internal (business data), public — ทุก column confidential/
restricted ต้องมี masking rule + legal basis Retention period ต้องเป็นตัวเลขเดือนเสมอ พร้อม
**erasure mechanics**: ลบตามลำดับใด (source table → extract → dashboard cache → model training set)
— ลบเฉพาะตารางต้นทางไม่ถือว่าเสร็จ (ดู `02-CORE-02` §7)

**Cost Governance** ต้องมี monthly budget เป็นตัวเลขพร้อม named owner, cost dashboard + alert
threshold (warning/critical), query guard rail ต่อ role (bytes limit, auto-kill runaway query), และ
cost attribution label (`team`, `dashboard_id`, `pipeline_name`) ต่อ query — สามตัวเลขนี้คนละแกนจาก
CONSTRAINTS.md's delivery budget เสมอ (ดู `02-CORE-02` §9)

## 【C|วิศวกร】 agents_md — AGENTS.md (depends_on: [pipeline_spec, data_governance, constraints, data_model_spec])

หกหัวข้อบังคับ: Project Overview, Tech Stack, Query & Modeling Conventions, Forbidden Patterns,
Data Quality & Testing Rules, PDPA Rules — briefing สำหรับ **AI coding agent** ไม่ใช่มนุษย์ ย้ำกติกา
ที่ CONSTRAINTS.md, DATA_GOVERNANCE.md และ DATA_MODEL_SPEC.md ตัดสินไปแล้ว ไม่ใช่ที่ตัดสินใจใหม่ —
**generate หลัง `data_governance` ทั้งที่เป็น P0** เพราะถ้า generate ก่อน DATA_GOVERNANCE.md เสร็จ
agent จะแต่งกติกา access ขึ้นมาเองแล้วขัดกับของจริงทีหลัง Tech Stack ต้องคัดลอกจาก CONSTRAINTS.md §
Platform & Tooling ตรงๆ ห้ามเขียนใหม่

**Forbidden Patterns ต้อง ≥6 ข้อ ทุกข้อในรูป "ห้าม X เพราะ Z ให้ใช้ Y แทน"** — ข้อห้ามลอยๆ ทำให้
agent เดาว่าควรทำอะไรแทน ซึ่งอันตรายกว่าไม่ห้ามเลย ตัวอย่างที่หนักแน่นที่สุด: ห้ามนิยาม metric
formula นอก METRIC_SPEC.md/METRIC_LOGIC.md, ห้าม hardcode threshold แทนค่า calibrate, ห้ามให้
dashboard คำนวณ metric ซ้ำ **PDPA Rules ต้องระบุชื่อคอลัมน์จริงเป็น `schema.table.column`** ห้าม
เขียนรวมๆ ว่า "PII fields" — และคอลัมน์เหล่านั้นต้องมี `pdpa_classification` จริงใน DATA_MODEL_SPEC.md
แล้ว ไม่ใช่แค่ชื่อคอลัมน์ที่ดูน่าจะเป็น PII ความยาวไฟล์ 600–900 คำ — เกินแปลว่ากลายเป็น reference
manual (โหลดเป็น context ทุก task)

## 【B|ทีมงาน】 tasks — TASKS.md (depends_on: [kpi_dictionary, pipeline_spec])

สี่หัวข้อบังคับ: Task Breakdown, Task Sequence and Dependencies, Definition of Done, Assignments and
Estimates — generate หลัง AGENTS.md เพราะ Definition of Done อ้างถึง convention ที่นั่น **กฎสำคัญ:**
ทุก P0 KPI ใน KPI_DICTIONARY.md และทุก P0 metric ใน METRIC_SPEC.md ต้องมีอย่างน้อยหนึ่ง task รองรับ —
KPI ที่ไม่มี task คือความตั้งใจที่ไม่มีแผนจะทำจริง

**เอกสารนี้เป็นเจ้าของ `work_item_status` enum** (not started / in progress / done) — เอกสารอื่น
อ้างชื่อ ไม่ประกาศซ้ำ **คนละ enum กับ `metric_status`** ของ METRIC_SPEC.md (draft/certified/
deprecated ของ entity ในตัวผลิตภัณฑ์) — ชื่อพ้องกันแต่คนละชั้น ห้ามใช้ปนกัน (ดู `06-REF-03` สำหรับ
ข้อบกพร่องจริงที่เกิดจากการไม่ตั้งชื่อ enum นี้มาก่อน) Definition of Done ต้องอ้าง AGENTS.md
convention จริง ไม่ใช่เขียนกฎใหม่

## 【C|วิศวกร】 lineage — LINEAGE.md (depends_on: [metric_logic, pipeline_spec, data_model_spec, dashboard_spec])

สี่หัวข้อบังคับ: Metric-to-Source Traces, Table-level Lineage, Impact Analysis Matrix, Breaking
Change Impact — ทุก metric ใน METRIC_LOGIC.md ต้องมี complete lineage trace พร้อม Mermaid diagram
และ column-level lineage สำหรับ P0 KPI **Lineage ≠ Impact Analysis** (ดู `02-CORE-02` §4): lineage
มองย้อนกลับ, impact analysis มองไปข้างหน้า (source เปลี่ยนแล้วอะไรพังบ้าง — "blast radius") มี
อย่างแรกโดยไม่มีอย่างหลังแปลว่าอธิบายความเสียหายได้หลังเกิดแล้วเท่านั้น Impact Analysis Matrix ต้อง
ครอบคลุมทุก source system ใน PIPELINE_SPEC.md พร้อม Blast Radius Score (จำนวน metric × จำนวน
dashboard ที่กระทบ) — Breaking Change Assessment Template ใช้ก่อนทำ breaking change ทุกครั้ง พร้อม
downstream consumer checklist และ rollback plan

## 【D|Data-Governance】 ai_model_spec — AI_MODEL_SPEC.md (depends_on: [data_model_spec, metric_spec, data_quality, lineage])

หกหัวข้อบังคับ: Model Inventory, Model Profiles, Feature Definitions, Training Data Spec,
Evaluation Metrics, Deployment and Monitoring — เอกสารนี้เป็นเจ้าของ `model_status` enum
(Production/Staging/Experimental/Deprecated) ทุก feature ต้องอ้าง column reference จาก
DATA_MODEL_SPEC.md ตรงๆ พร้อม **feature lineage** ที่ trace กลับ source ได้ตาม LINEAGE.md — feature
ที่ trace ไม่ได้ ตอน source เปลี่ยนจะไม่มีใครรู้ว่าโมเดลตัวไหนพัง

Label definition ต้องชัดเจนและ measurable Train/Val/Test split ต้องเป็น **time-based** สำหรับ time
series (ไม่ใช่ random — random split ทำให้เกิด data leakage, AUC ดูดีตอน test แต่ production
performance แย่กว่ามาก) Evaluation Metrics ต้องมี acceptance threshold + retraining trigger เป็น
ตัวเลข **Model Drift Detection ต้องมี threshold + alert route + เจ้าของ** — "ตรวจจับ drift" ที่ไม่มี
ตัวเลขและปลายทางคือความตั้งใจ ไม่ใช่การเฝ้าระวัง Business Action ต้อง link กับ action threshold จาก
METRIC_SPEC.md เสมอ เพื่อให้ "at-risk" มีนิยามเดียวกันทั้งระบบ

## 【D|Data-Governance】 runbook — RUNBOOK.md (depends_on: [pipeline_spec, sla_freshness, data_quality])

หกหัวข้อบังคับ: Common Failure Scenarios, Triage Checklist, Recovery Procedures, Escalation
Contacts, Post-Incident Review, Retention Enforcement & Archival — ต้องมี **≥5 failure scenarios**
ทุก scenario มี Trigger Condition (alert ตัวไหน threshold เท่าไร), severity, first response steps,
root cause checklist, recovery procedure พร้อม verification query, และ **Rollback Steps** (จุดที่
ย้อนไม่ได้ต้องระบุ) เอกสารนี้เป็นเจ้าของ `incident_severity` enum (**SEV1/SEV2/SEV3** — คนละสัญลักษณ์
จาก `data_need_priority`/`dataset_criticality` โดยตั้งใจ หลัง fix ความกำกวมสามทางที่เคยเกิดจริง ดู
NB4 ใน `01-GOV-01`)

**Retention Enforcement & Archival แปลง retention policy ของ DATA_GOVERNANCE.md ให้เป็นขั้นตอน
ปฏิบัติจริง** — purge/archive job ต่อ dataset (schedule ต้อง trace กลับไป retention period),
restore procedure ที่ทดสอบแล้วจริง (ทุก 6 เดือน — restore ไป schema แยก ห้าม load ทับ production),
volume-anomaly guard (rows deleted ต่างจากค่าเฉลี่ย >50% → หยุด job กัน retention bug ลบเกิน) และ
**PDPA erasure workflow ที่ครอบคลุม archive layer** — archive ไม่ใช่ข้อยกเว้นของ PDPA (จุดที่พลาด
บ่อยที่สุด)

## 【A|ผู้บริหาร】 analytics_changelog — ANALYTICS_CHANGELOG.md (depends_on: [metric_spec, kpi_dictionary, pipeline_spec, data_contract])

สี่หัวข้อบังคับ: Metric Definition Changes, KPI Target Changes, Pipeline Changes, Breaking Changes
Log — เป้าหมายหลักคือป้องกัน **"silent metric change"** ซึ่งเป็นสาเหตุอันดับ 1 ที่ทำให้ทีมสูญเสีย
ความเชื่อมั่นใน data ทุก entry ต้องมีครบ: date, before/after, reason, approved_by,
breaking_change flag เอกสารนี้เป็นเจ้าของ `change_type` enum **Metric Definition Changes สำคัญ
ที่สุด** เพราะกระทบ historical comparison — breaking change ต้องระบุว่า historical data recalculate
ย้อนหลังหรือคงสูตรเก่าไว้คู่กัน และต้องผ่าน notice period ตาม DATA_CONTRACT.md ก่อนเสมอ (ดู
`02-CORE-02` §6) Breaking Changes Log เป็นตาราง summary รวมทุกอย่างไว้ที่เดียว — ใช้ค้นหาเมื่อต้องการ
รู้ว่า change ใดทำให้ historical data discontinuity

## 【B|ทีมงาน】 readme — README.md (depends_on: [stakeholders, pipeline_spec, runbook, testing_strategy])

แปดหัวข้อบังคับ: Project Name and Description, Quick Start, Prerequisites, Installation, Usage,
Architecture Overview, Contributing, License — generate **ท้ายสุด**ในทุก template เพราะต้องอ้าง
เอกสารเกือบทั้งหมด **Quick Start ต้องเป็นชุดคำสั่งที่รันได้จริง แต่ละ step มีผลลัพธ์ที่สังเกตได้**
(`dbt run` สำเร็จ, dashboard render, test ผ่าน) ไม่ใช่คำอธิบายลอยๆ อย่าง "รัน dbt แล้วเปิด dashboard"
Prerequisites ระบุเวอร์ชันที่ทดสอบแล้วจริง ห้ามเขียน "เวอร์ชันล่าสุด" Contributing ต้องชี้ไปที่
AGENTS.md เสมอ — engineer ใหม่ที่ทำตามได้ครบควรใช้เวลา < 30 นาที
