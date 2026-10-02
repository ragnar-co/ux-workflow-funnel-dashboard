---
title: บทเรียนจากข้อบกพร่องจริง
document_id: 06-REF-03-lessons-from-real-defects
version: 1.0.0
created_at: 2026-09-22
audience: all
owns: [real-defect-lessons]
defers_to: [01-GOV-01-authority-truth-and-claims.md]
---

# บทเรียนจากข้อบกพร่องจริง

ไฟล์นี้คือ**ข้อบกพร่องที่รายงานจากประวัติจริงของ repo `ddd`** จึงเป็นหลักฐาน ไม่ใช่เรื่องแต่ง — แต่ยัง
เป็นหลักฐาน ไม่ใช่อำนาจ เอาไปแก้นิยามของ `01-GOV-01` หรือ `02-CORE-01/02` ทับไม่ได้ (ดู tier rule ใน
`01-GOV-01` §1) ทุกข้อยืนยันด้วย commit hash จริงที่มีอยู่ใน git history ของ repo นี้

## 【D|Data-Governance】 `eb44315` — P0/P1/P2 เป็น enum เดียวที่ไม่ได้ลงทะเบียนและมีสามความหมาย

**ก่อนแก้:** `stakeholders`, `sla_freshness` และ `runbook` ใช้สัญลักษณ์ `P0`/`P1`/`P2` ร่วมกันโดยไม่มี
ชื่อ enum อย่างเป็นทางการ ไม่มีเอกสารเจ้าของที่แยกกันชัด — สามความหมายที่ต่างกันโดยสิ้นเชิง (data need
priority, dataset criticality, incident severity) ถูกมองว่าเป็น "P0" เดียวกัน ทำให้อ่านข้ามเอกสารแล้ว
เข้าใจผิดว่าเป็นสเกลเดียว

**หลังแก้:** แยกชื่อเป็นสาม enum อิสระและลงทะเบียนใน Enumeration Registry: `data_need_priority`
(STAKEHOLDERS.md), `dataset_criticality` (SLA_FRESHNESS.md), `incident_severity` (RUNBOOK.md —
เปลี่ยนรูปแบบค่าเป็น `SEV1`/`SEV2`/`SEV3` ไปเลยเพื่อไม่ให้สับสนกับสองตัวแรกแม้แต่รูปร่าง)

**บทเรียน:** สัญลักษณ์ที่ดูคุ้นตา (P0/P1/P2) ใช้ซ้ำข้ามเอกสารได้ง่ายโดยไม่ตั้งใจ โดยเฉพาะเมื่อทั้งสาม
เอกสารเขียนโดยคนละคนคนละช่วงเวลา — นี่คือต้นเหตุของ NB4 ใน `01-GOV-01` ดู `02-CORE-01` Canonical
Ownership Table

## 【C|วิศวกร】 `eb44315` — Data Literacy Guard Rail ขัดกับเอกสารที่ตัวเองอ้างถึง

**ก่อนแก้:** `meta.quality_gate` เขียนว่าอนุญาต "advanced viz (crosshair, animation)" ที่
`data_literacy_level >= intermediate` แต่ `VIZ_DESIGN_SPEC.md`'s Data Literacy Guard Rails
classification ตัวเองกำหนด crosshair เป็น intermediate ส่วน **animation เป็น advanced** — สอง
เอกสารขัดกันเองในเรื่องที่ VIZ_DESIGN_SPEC.md เป็นเจ้าของ

**หลังแก้:** quality_gate แก้ให้ตรงกับ mapping ที่ VIZ_DESIGN_SPEC.md ประกาศไว้ — animation = advanced
เสมอ ไม่มีข้อยกเว้นที่ intermediate

**บทเรียน:** การเขียน rule ในเอกสารระดับ meta (quality_gate) ที่อ้างถึงนิยามของเอกสารลูก ต้อง sync
กับนิยามนั้นจริง ไม่ใช่แค่อ้างชื่อ — ดู regression guard ที่ `01-GOV-01` §7 และแบบฝึกหัด 6 ที่
`05-PRACTICE-01`

## 【B|ทีมงาน】 `1b51f2a` — track ทั้งหมดขาดสี่เอกสารมาตรฐานที่ track อื่นมีครบ

**ก่อนแก้:** data-analytics เป็น template เดียวที่ยังไม่มี `CONSTRAINTS.md`, `AGENTS.md`, `TASKS.md`,
`README.md` — สี่เอกสารที่ทุก track อื่นมี ทำให้ template หยุดที่ 19 เอกสาร และ `PIPELINE_SPEC.md`'s
bridge ไปยัง web-app's `TRACKING_PLAN.md` เป็นความสัมพันธ์ทางเดียว (ประกาศไว้ฝั่งเดียว ไม่มี
`DATA_CONTRACT.md` § Upstream Event Contract รับ)

**หลังแก้:** เพิ่มครบ 4 เอกสาร (19 → 23 เอกสาร) พร้อม `domain_specific_notes` ใหม่แยก CONSTRAINTS.md
(สิ่งที่ต้องจริงก่อน launch) จาก DATA_GOVERNANCE.md (สิ่งที่ต้องจริงตลอดการใช้งาน) และปิด bridge ให้
สมบูรณ์สองทาง — `DATA_CONTRACT.md` ได้ section "Upstream Event Contract (Product Events)" ใหม่

**บทเรียน:** เอกสารที่ track อื่นมีครบแต่ track หนึ่งขาด ไม่ใช่แค่ "เอกสารน้อยกว่า" — เป็นช่องว่างเชิง
สัญญา (ไม่มีที่เก็บ platform constraint, ไม่มี AI-agent briefing, ไม่มี task breakdown, ไม่มี
onboarding) ที่ readiness gate มองไม่เห็นจนกว่าจะมีคนถามหาเอกสารเหล่านั้นตรงๆ

## 【B|ทีมงาน】 `e1109f7` — `work_item_status` ใช้จริงในสี่ track แต่ไม่เคยตั้งชื่อหรือลงทะเบียน

**ก่อนแก้:** `tasks.assignments_estimates` ประกาศค่า status inline ("Status — Not Started / In
Progress / Done / Blocked" ในสาม track, **"three lowercase values in ddd-data-analytics"** — ค่า
`not started`/`in progress`/`done` แบบตัวพิมพ์เล็ก) โดยไม่มีชื่อ enum อย่างเป็นทางการ ไม่มีเอกสาร
เจ้าของที่ระบุชัด และไม่มีแถวใน BUSINESS_GLOSSARY.md's Enumeration Registry — ใช้จริงทุกที่ ดัชนี
ไม่มีที่ไหน

**หลังแก้:** ตั้งชื่อ `work_item_status` เป็นเจ้าของโดย TASKS.md ในทั้งสี่ track ที่มีเอกสาร tasks
(web-app, ai-workflow, ai-chatbot, data-analytics) ลงทะเบียนใน Enumeration Registry พร้อมระบุชัดว่า
"ไม่ใช่สถานะของ entity ในตัวผลิตภัณฑ์" — สำหรับ data-analytics คือไม่ใช่ `metric_status` ของ
METRIC_SPEC.md

**บทเรียน:** นี่คือต้นเหตุของ NB5 ใน `01-GOV-01` — enum ที่ใช้จริงทั่วทั้งเอกสารแต่ไม่เคยผ่านการตั้งชื่อ
+ลงทะเบียน คือ registry ที่ชี้ไปยังเป้าหมายว่าง ดู `02-CORE-01` Canonical Ownership Table และ
`02-CORE-02` distinction เรื่อง status ที่พ้องชื่อ
