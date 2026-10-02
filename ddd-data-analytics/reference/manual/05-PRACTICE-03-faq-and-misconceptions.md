---
title: FAQ และความเข้าใจผิดที่พบบ่อย
document_id: 05-PRACTICE-03-faq-and-misconceptions
version: 1.0.0
created_at: 2026-09-22
audience: all
owns: [faq]
defers_to: [02-CORE-01-what-this-template-is.md, 02-CORE-02-distinctions-and-doctrines.md]
---

# FAQ และความเข้าใจผิดที่พบบ่อย

## 【A|ผู้บริหาร】 ปัญหาอะไรที่ ddd-data-analytics แก้

ช่วยทีมผลิตเอกสารโครงการที่สอดคล้องกันครบ 23 ฉบับสำหรับวาง analytics layer บนระบบ operational ที่มี
อยู่แล้ว — KPI ที่ตกลงร่วมกัน, metric logic ที่คำนวณมัน, pipeline ที่ป้อนข้อมูล, dashboard/report
ที่คนใช้ตัดสินใจ ดู `02-CORE-01` สำหรับนิยามเต็มและเมื่อไหร่ไม่ควรใช้

## 【A|ผู้บริหาร】 data-analytics ต่างจาก postgresql-design / web-app ยังไง

data-analytics = เจ้าของ KPI/metric definition และ dashboard/report ที่ธุรกิจใช้ตัดสินใจ ·
postgresql-design = เจ้าของ schema ของฐานข้อมูล operational เอง (ไม่ใช่ metric ที่คำนวณจากมัน) ·
web-app = เจ้าของ event ที่ user ทำในแอป (TRACKING_PLAN.md) ซึ่งเป็น upstream producer ที่
data-analytics บริโภคผ่าน optional integration เท่านั้น — ดู `02-CORE-01` §"เทียบกับ track ใกล้เคียง"

## 【C|วิศวกร】 hub เอกสารของแต่ละ phase คืออะไร

`METRIC_SPEC.md` (hub ของ Business Layer — 5 downstream) และ `DATA_MODEL_SPEC.md` (hub ใหญ่ที่สุด
ของทั้ง template — 8 downstream) เขียนผิดสองฉบับนี้กระทบเป็นลูกโซ่มากที่สุด ดู `03-PHASE-01` และ
`03-PHASE-02`

## 【C|วิศวกร】 KPI, metric, dimension ต่างกันยังไง

KPI คือผลลัพธ์ธุรกิจที่มีคนรับผิดชอบ (KPI_DICTIONARY.md) · metric คือตัวเลขที่ขยับ KPI นั้น
(METRIC_SPEC.md, ต้องมี `parent_kpi` เสมอ) · dimension คือสิ่งที่ใช้ slice ทั้งสอง
(DATA_MODEL_SPEC.md) — ดูตารางเต็มที่ `02-CORE-02` §1

## 【C|วิศวกร】 freshness, completeness, correctness ต่างกันยังไง

freshness = ข้อมูลมาตรงเวลาไหม (SLA_FRESHNESS.md) · completeness = แถวที่ควรมีอยู่ครบไหม
(DATA_QUALITY.md) · correctness = ตัวเลขที่คำนวณถูกไหม (TESTING_STRATEGY.md) — dashboard สดและครบ
ยังผิดได้ ต้องมี alert คนละตัว เจ้าของคนละคน ดู `02-CORE-02` §2

## 【D|Data-Governance】 data contract, quality rule, test ต่างกันยังไง

data contract = ข้อตกลงกับ producer (DATA_CONTRACT.md) · quality rule = สิ่งที่ตรวจตอนข้อมูลมาถึง
(DATA_QUALITY.md) · test = สิ่งที่รันใน CI ก่อน deploy (TESTING_STRATEGY.md) — ยุบสามอย่างนี้ทำให้
"producer เปลี่ยน schema" หน้าตาเหมือน "transformation ของเราเองพัง" ดู `02-CORE-02` §3

## 【B|ทีมงาน】 priority/criticality/severity แยกกันยังไงไม่ให้ปน

`data_need_priority` (STAKEHOLDERS.md) ≠ `dataset_criticality` (SLA_FRESHNESS.md, คนละแกนแม้
สัญลักษณ์ P0/P1/P2 เหมือนกัน) ≠ `incident_severity` (RUNBOOK.md, จริงๆ ใช้ SEV1/SEV2/SEV3 คนละ
สัญลักษณ์เลย) — ดู `02-CORE-01` Canonical Ownership Table และ NB4 ใน `01-GOV-01` ก่อนตอบคำถามที่มี
"P0" ลอยๆ

## 【C|วิศวกร】 metric_status กับ work_item_status ต่างกันยังไง

`metric_status` (draft/certified/deprecated, เจ้าของ METRIC_SPEC.md) คือสถานะของ**นิยาม metric** —
เปลี่ยนนิยาม metric ที่ certified แล้วคือ breaking change · `work_item_status` (not started/in
progress/done, เจ้าของ TASKS.md) คือสถานะของ**งานที่กำลังทำ** — ชื่อพ้องกันในหลายบริบท (คำว่า
"status") แต่คนละชั้นคนละ enum เด็ดขาด ห้ามใช้ปนกัน

## 【D|Data-Governance】 PDPA erasure request ต้องไปถึงชั้นไหนบ้าง

source table → staging → mart → extract → dashboard cache → model training set → cold-storage
archive — ลบเฉพาะตาราง source ไม่ถือว่าเสร็จ archive **ไม่ใช่**ข้อยกเว้นของ PDPA ดู `02-CORE-02` §7
และขั้นตอนจริงที่ `03-PHASE-05` §RUNBOOK.md

## 【D|Data-Governance】 delivery budget, cost ceiling, query guard rail ต่างกันยังไง

delivery budget = เงินสร้างครั้งเดียว (CONSTRAINTS.md) · monthly cost ceiling = budget รายเดือน
ต่อเนื่อง (DATA_GOVERNANCE.md) · query guard rail = per-query bytes limit ต่อ role
(DATA_GOVERNANCE.md) — เขียนปนกันทำให้ผู้อ่านไม่รู้ว่าเลขนี้ใช้กับเอกสารไหน ดู `02-CORE-02` §9

## 【A|ผู้บริหาร】 metric formula เขียนซ้ำใน dashboard ได้ไหม

ไม่ได้ — AGENTS.md ประกาศตรงๆ ว่าสูตรมีที่เดียวคือ METRIC_LOGIC.md dashboard หรือ model ใดคำนวณ
metric เดียวกันด้วยสูตรของตัวเองคือข้อบกพร่อง ไม่ใช่ทางลัด (ดู `03-PHASE-02` §metric_logic)

## 【B|ทีมงาน】 enum แต่ละตัวใครเป็นเจ้าของ

ตารางเต็มที่ `02-CORE-01` §"Canonical Ownership Table" และ `06-REF-01-glossary-and-enums.md` — 13
enum ข้าม 10 เอกสาร

## 【B|ทีมงาน】 ควรเริ่มเขียนเอกสารไหนก่อน

`stakeholders`, `constraints`, `kpi_dictionary`, `business_glossary` — ทั้งสี่ไม่มี `depends_on`
เขียนพร้อมกันได้ ลำดับเต็มที่ `04-SPEC-01-doc-map.md`

## 【B|ทีมงาน】 depends_on ของแต่ละเอกสารคืออะไร

ตารางเต็มที่ `04-SPEC-01-doc-map.md` — ถ้าต้องผลิตเอกสารจริง ให้ทำตาม Production Protocol ในไฟล์
เดียวกัน (STOP ถ้า dependency ขาด ห้ามผลิตต่อ)

## 【C|วิศวกร】 ผลิตเอกสาร data-analytics จริงให้ปลอดภัยยังไง

ทำตาม Production Protocol ใน `04-SPEC-01-doc-map.md` ทีละขั้น — ระบุ target → ตรวจการ์ด → ตรวจ
depends_on → STOP ถ้าขาด → เขียนจากเอกสารเจ้าของเท่านั้น → ตรวจ heading ครบ

## 【A|ผู้บริหาร】 ความเข้าใจผิดที่พบบ่อย

- **"NRR ≥110% คือค่าที่ต้องใช้"** — ผิด เป็นค่าตัวอย่างสอนของ TaskFlow (`[ILLUSTRATIVE]`) target
  จริงต้อง approve จาก CEO/business stakeholders และอ้าง OKR ของบริษัทตัวเอง
- **"P0 หมายถึงด่วนสุดเสมอ"** — ผิด ขึ้นกับว่าเป็น P0 ของ data need, ของ dataset criticality หรือ
  SEV ของ incident คนละสเกลคนละเจ้าของ
- **"animation chart ใช้กับ audience literacy ระดับ intermediate ได้"** — ผิด animation คือ
  complexity ระดับ advanced เสมอ (ค่านี้เคย drift มาก่อน ดู `01-GOV-01` §7)
- **"BUSINESS_GLOSSARY.md Enumeration Registry เก็บค่า enum ไว้ให้ค้นเร็ว"** — ผิด มันเป็นดัชนี
  ชื่อ+เจ้าของเท่านั้น ห้ามมีค่าจริง (NB3)
- **"dashboard คำนวณ metric เองเร็วกว่า ไม่ต้องรอ pipeline"** — ผิด ละเมิดกฎ metric ownership ที่
  AGENTS.md ประกาศไว้ตรงๆ ทำให้เกิดตัวเลขสองชุดที่ไม่ตรงกันเมื่อสูตรเปลี่ยน
