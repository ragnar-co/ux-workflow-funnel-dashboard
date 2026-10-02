---
title: Business Layer — Why & KPI (5 เอกสาร)
document_id: 03-PHASE-01-business-layer
version: 1.0.0
created_at: 2026-09-22
audience: all
owns: [phase-business-howto]
defers_to: [02-CORE-01-what-this-template-is.md, 04-SPEC-01-doc-map.md]
---

# Business Layer — Why & KPI

ลำดับผลิต: `stakeholders`, `constraints`, `kpi_dictionary`, `business_glossary` ไม่มี `depends_on`
เขียนคู่กันได้ทันที (root documents ทั้งสี่) — `metric_spec` ต้องรอทั้งสามตัวหลัง (kpi_dictionary,
business_glossary, stakeholders)

## 【A|ผู้บริหาร】 stakeholders — STAKEHOLDERS.md (depends_on: [])

สองหัวข้อบังคับ: Stakeholder Profiles, Data Needs Matrix ทุก stakeholder ต้องมีครบ 7 field รวม
`team` (เพิ่มเข้ามาเพราะ `DATA_GOVERNANCE.md`'s access control ให้สิทธิ์ตามทีม ไม่ใช่รายบุคคล) —
เอกสารนี้เป็นเจ้าของ `data_literacy_level` (low/medium/high) ที่ `VIZ_DESIGN_SPEC.md` ใช้เป็น gate
ความซับซ้อนของ chart และ `data_need_priority` (P0/P1/P2 — "cannot operate without" ไม่ใช่สเกล
เดียวกับ `dataset_criticality` หรือ `incident_severity`, ดู NB4 ใน `01-GOV-01`) — Data Needs Matrix
ต้องระบุทั้ง priority และ freshness requirement ต่อ cell ห้ามใส่ P0 ให้ทุก KPI (กฎ: ไม่เกิน 2-3 KPI
ต่อ stakeholder)

## 【A|ผู้บริหาร】 constraints — CONSTRAINTS.md (depends_on: [])

ห้าหัวข้อบังคับ: Platform & Tooling, Scale, Compliance & Residency, Project Budget & Timeline,
Integration — เอกสารนี้เป็น**root document เดียวที่ทำ scale projection ล่วงหน้า** (row count ของ fact
table ที่โตเร็วที่สุด ที่ปี 1 และปี 3, rate limit ของ source API ที่แคบที่สุด, concurrency quota) —
ไม่มีเอกสารอื่นใน template นี้ทำเรื่องนี้ ถ้าไม่มีตัวเลขจริงให้ใส่ `null` พร้อมชื่อคนที่จะให้ตัวเลข
(NB1) **ห้ามเขียนซ้ำกับ `DATA_GOVERNANCE.md`** — เอกสารนี้เก็บสิ่งที่ต้องจริง**ก่อน**launch (delivery
budget ครั้งเดียว, compliance residency), `DATA_GOVERNANCE.md` เก็บสิ่งที่ต้องจริง**ตลอด**การใช้งาน
(cost ceiling รายเดือน, retention, access control) — ดู distinction เต็มที่ `02-CORE-02` §9

## 【A|ผู้บริหาร】 kpi_dictionary — KPI_DICTIONARY.md (depends_on: [])

สี่หัวข้อบังคับ: KPI Catalog, KPI Hierarchy (CEO to Team Level), Measurement Frequency, KPI Owners —
เอกสารรากฐานที่สุดของ template นี้ (ไม่มี dependency, เขียนพร้อม stakeholders ได้) **กฎที่สำคัญ
ที่สุด:** target ต้องเป็นตัวเลขเสมอ ("≥110%", "<2%") ห้ามใช้คำกว้างอย่าง "ดีขึ้น" หรือ "TBD" — KPI
Hierarchy ต้องมีครบ 3 ระดับ (Company/Department/Team) พร้อม parent-child mapping ที่ต่อเนื่อง ขาด
ระดับใดระดับหนึ่งทำให้ทีมล่างไม่รู้ว่าต้อง prioritize อะไรเพื่อ "ป้อน" KPI ระดับบน owner ทุก KPI
ระบุเป็น **role** เสมอ ไม่ใช่ชื่อบุคคล

## 【B|ทีมงาน】 business_glossary — BUSINESS_GLOSSARY.md (depends_on: [])

สี่หัวข้อบังคับ: Term Definitions, Disputed Terms, Change Log, Enumeration Registry — เอกสารนี้คือ
**naming authority** ของทั้ง template (ดู `02-CORE-02` §5) generate เป็นลำดับที่สาม **ก่อน**เอกสาร
เจ้าของ enum ส่วนใหญ่จะมีอยู่ ดังนั้น Enumeration Registry เริ่มจาก owner map ที่ตั้งใจไว้ล่วงหน้า
แล้ว reconcile รอบสองเมื่อเอกสารเจ้าของเขียนเสร็จจริง (ดู full list 13 enum ที่ `02-CORE-01`) —
Disputed Terms ต้องมี ≥3 คำ ทุกคำต้องมี `approval_date` จริง ห้ามมี "TBD" ถ้ายังไม่ได้ resolution
ห้ามอ้างจาก METRIC_SPEC.md **Registry Rule ที่เข้มที่สุด:** ห้ามมีค่า enum จริงปรากฏในตารางนี้ — มีแต่
ชื่อ enum กับเอกสารเจ้าของ (NB3)

## 【A|ผู้บริหาร】 metric_spec — METRIC_SPEC.md (depends_on: [kpi_dictionary, business_glossary, stakeholders])

สี่หัวข้อบังคับ: Metric Profiles, Formula Reference, Grain and Filter Matrix, Action Thresholds —
เอกสารนี้เป็น **hub เอกสารที่สำคัญที่สุดของ Business Layer** เพราะมี downstream ถึง 5 ฉบับ
(data_model_spec, metric_logic, dashboard_spec, ai_model_spec, analytics_changelog) ทุก metric ต้อง
มี `parent_kpi` ที่อ้าง ID จาก KPI_DICTIONARY.md เสมอ (ห้าม free-form) — **Grain** คือหัวข้อที่พลาด
บ่อยที่สุด: ต้องระบุ "1 [entity] × 1 [time_unit]" เสมอ (`1 customer × 1 calendar month` ไม่ใช่แค่
"monthly") เพราะ grain ที่ต่างกันให้ aggregate ต่างกันและ join กันตรงๆ ไม่ได้ — Action Thresholds
แยก warning (yellow, ยังไม่ต้อง escalate) กับ critical (red, ต้อง escalate ทันที) เพื่อกัน alert
fatigue เอกสารนี้ยังเป็นเจ้าของ `metric_status` enum (draft/certified/deprecated — เปลี่ยนนิยาม
metric ที่ certified แล้วคือ breaking change ตาม `02-CORE-02` §6)
