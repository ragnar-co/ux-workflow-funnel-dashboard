---
title: กติกาความน่าเชื่อถือ ความจริง และข้อกล่าวอ้าง
document_id: 01-GOV-01-authority-truth-and-claims
version: 1.0.0
created_at: 2026-09-22
audience: all
owns: [authority-ladder, tie-break-rule, content-status-labels, named-bans, illustrative-rule, refusal-policy, source-regime, regression-guard]
defers_to: []
---

# กติกาความน่าเชื่อถือ ความจริง และข้อกล่าวอ้าง

ไฟล์นี้เป็นกฎที่ผู้ช่วยใช้ตัดสินทุกครั้งที่เจอคำถามสองประเภท: (1) สองไฟล์ในชุดนี้ขัดกัน เชื่ออันไหน
(2) ตัวเลข/ค่าที่เห็นในชุดนี้เอาไปใช้กับโปรเจกต์จริงได้ไหม ถ้าไฟล์อื่นในชุดขัดกับไฟล์นี้ในสองเรื่องนี้
ให้เชื่อไฟล์นี้

## 【A|ผู้บริหาร】 1. Authority Ladder

เลขนำหน้าชื่อไฟล์ (`00`–`06`) เรียงตามอำนาจจากมากไปน้อยในเรื่องที่ tier นั้นรับผิดชอบ — **เท่ากับ**
canonical ownership ที่ตัว `ddd` repo ใช้เอง (template/manual เป็นเจ้าของสัญญา, เอกสารอื่นอ้างชื่อ
ไม่ประกาศค่าซ้ำ) ยกระดับมาเป็นโครงสร้างของแพ็กสอนนี้

| Tier | หมวด | ถ้าขัดกับ tier อื่น |
|---|---|---|
| `00` INDEX | นำทางเท่านั้น | ไม่มีอำนาจเชิงเนื้อหา |
| `01` GOV | กติกาของทั้งชุด | ชนะทุกไฟล์เรื่องการอ้างอิง ป้ายสถานะ และข้อห้าม |
| `02` CORE | นิยามและเจ้าของข้อมูล — รวม distinction ที่พิสูจน์แล้ว | ชนะ `03` `05` `06` เรื่องว่าเอกสารไหนเป็นเจ้าของอะไร |
| `03` PHASE | วิธีเขียนเอกสารใน layer | ชนะ `05` `06` เรื่องวิธีปฏิบัติ แต่แพ้ `02` เรื่องนิยาม |
| `04` SPEC | แผนที่เอกสาร 23 ฉบับ | แหล่งเดียวสำหรับลำดับการผลิตและ `depends_on` |
| `05` PRACTICE | แบบฝึกหัด checklist FAQ | ไม่ใช่แหล่งนิยาม ใช้ฝึกและตรวจเท่านั้น |
| `06` REF | enum, เคส TaskFlow, บทเรียนจริง | สามไฟล์คนละสถานะความจริง — ห้ามรวมเป็นก้อนเดียว (ดู §3) |

**Depth band vocabulary ของแพ็กนี้**: `【A|ผู้บริหาร】` executive/business-outcome framing ·
`【B|ทีมงาน】` build-team/cross-functional framing · `【C|วิศวกร】` engineer/implementer framing ·
`【D|Data-Governance】` PDPA/access-control/retention/cost-governance framing — แถบนี้เฉพาะแพ็กนี้
เพราะ data-analytics มีเสา governance (access control, PII classification, retention/erasure, cost
guard rails) ที่หนักกว่า track อื่นที่ใช้ A/B/C ชุดเดียวกัน (`chat-pack/web-app/` และ
`chat-pack/context-engineering/`)

## 【B|ทีมงาน】 2. Tie-break — เมื่อ tier ตัดสินไม่ได้

กติกาจริงคือฟิลด์ **`owns:`** ในหน้าไฟล์ ไฟล์ไหนประกาศ `owns` หัวข้อนั้น ไฟล์นั้นคือนิยามเป๊ะ ไม่ว่า
tier จะสูงหรือต่ำกว่า `defers_to` **ไม่ใช่ความสัมพันธ์แบบไล่ต่อเป็นทอด** — แปลว่า "ไฟล์นี้ยอมไฟล์ที่
ระบุไว้เฉพาะหัวข้อที่ไฟล์นั้น `owns`" เท่านั้น ห้ามไล่ A ยอม B แล้ว B ยอม C จึงสรุปว่า A ยอม C

ถ้าสองไฟล์ขัดกันจริงและ `owns:` ตัดสินไม่ได้ ให้บอกผู้เรียนตรงๆ ว่ามีความขัดแย้ง ระบุชื่อไฟล์ทั้งสอง
ห้ามเลือกข้างแบบเงียบๆ และห้ามสังเคราะห์คำตอบกลางๆ ที่ไม่มีอยู่ในไฟล์ไหนเลย

## 【B|ทีมงาน】 3. Content Status Labels — 3 ป้าย

| ป้าย | ความหมาย | ตัวอย่าง |
|---|---|---|
| **ยืนยันจาก template/manual** | สิ่งที่ template หรือ manual ระบุจริงเป็นโครงสร้างหรือเป็นกฎ | "data-analytics มี 23 เอกสาร 5 layer", "`metric_status` เป็น enum ที่ METRIC_SPEC.md เป็นเจ้าของ" |
| **ตัวอย่างเคส TaskFlow** | เนื้อหาและตัวเลขจากเคสที่แต่งขึ้นสอน (มาจาก `examples/analytics/` และหัวข้อ §4 ของ manual) | "MRR Churn Rate warning threshold > 3.0% `[ILLUSTRATIVE]`" |
| **การตีความของผู้เขียน** | คำอธิบายเชิงเหตุผลที่แพ็กนี้เพิ่มเข้ามาเพื่อให้เข้าใจ ไม่ได้เขียนไว้ตรงๆ ใน template | "DATA_CONTRACT.md คือ 'API spec' equivalent เพราะบรรยาย schema + SLA ระหว่าง producer/consumer" |

## 【A|ผู้บริหาร】 4. กฎการอ้างตัวเลข — TaskFlow ทุกตัวติด `[ILLUSTRATIVE]`

เคส TaskFlow เป็น B2B project-management SaaS ที่แต่งขึ้นทั้งหมด ตัวเลขทุกตัว — MRR target, churn
threshold, cost budget, retention period, SLA delay tolerance — **ไม่ได้มาจากการวัดผลของระบบจริง**
ติดป้าย `[ILLUSTRATIVE]` inline ทันทีหลังตัวเลข ไม่ใช่ประกาศรวมไว้หัวไฟล์แล้วปล่อยตัวเลขเปล่าในเนื้อหา

ข้อยกเว้น: (1) ตัวเลขโครงสร้างของ template เอง — 23 เอกสาร, 5 phase, 5/3/4/3/8 ฉบับต่อ phase, 6
readiness gate, 34 checklist item — ไม่ต้องติดป้าย เพราะตรวจได้จาก `ddd-data-analytics-v2.8.0.json`
โดยตรง (2) ชื่อ platform/tool (เช่น BigQuery, dbt Core, Looker, Zoho Analytics) ไม่ต้องติดป้ายรายตัว
แต่ต้องมีประโยคกำกับว่าการเลือกใช้เป็นของเคส

**enum ต้องแยกที่มาก่อนตัดสินว่าติดป้ายไหม** — ชื่อ enum และเอกสารเจ้าของอยู่ใต้ canonical ownership
เสมอ (ป้ายที่ 3 ไม่เปลี่ยน) แต่ชุดค่ามาได้จากสองที่: (a) **template เอง** กำหนดชุดค่าไว้จริง (เช่น
`data_literacy_level` = low/medium/high, `metric_status` = draft/certified/deprecated,
`incident_severity` = SEV1/SEV2/SEV3) — ไม่ติดป้าย เพราะเป็นสัญญาของ template ไม่ใช่ของ TaskFlow
(b) **โปรเจกต์กำหนดชุดค่า** (เช่น plan_tier จริง `starter`/`pro`/`enterprise` ของ TaskFlow) — เป็นของ
TaskFlow แต่เป็นค่าที่ manual §4 ยืนยันซ้ำในตัวอย่างเต็มของ template เอง จึงนับเป็น**ยืนยันจาก
manual** ไม่ใช่ค่าประดิษฐ์ของแพ็กนี้ — สังเกตต่างจาก threshold ตัวเลข (เช่น warning_threshold >
3.0%) ที่เป็นค่าตัวอย่างล้วนและต้องติดป้ายเสมอ

## 【A|ผู้บริหาร】 5. Named Bans

### NB1 — ห้ามเติมค่าที่ยังไม่ calibrate โดยไม่มีเจ้าของ

**ข้อห้าม:** quality threshold, anomaly bound, freshness tolerance, retention period, cost ceiling,
model acceptance threshold, scale projection, project budget ที่ยังไม่มีค่าจริง ห้ามเติมตัวเลขที่
"ดูสมเหตุสมผล" ต้องเขียนเป็น `null` พร้อมบทบาทที่ต้อง calibrate — นี่คือประโยคสุดท้ายของ
`quality_gate` เอง (คำต่อคำ): "Never invent a default for a value that needs calibration (quality
threshold, anomaly bound, freshness tolerance, retention period, cost ceiling, model acceptance
threshold, scale projection, project budget) — declare it null with its calibration source and
owner instead." เท่ากับ `operational_readiness` gate ข้อที่ว่าด้วยค่า null ทุกตัวต้องมีที่มาก่อน
go-live

**ตัวอย่างผิด:** "anomaly bound = 3 standard deviations (ค่ามาตรฐาน)" — นี่คือ invented default ที่
review ของ v2.6.0 จับได้จริง (ดู §7)
**ตัวอย่างถูก:** "anomaly bound = `null` — calibration owner: Analytics Engineer หลังมีข้อมูล 90 วัน
ย้อนหลัง (ดูตัวอย่างเต็มที่ `05-PRACTICE-01` แบบฝึกหัด 3)"

### NB2 — ห้ามอ้างตัวเลข TaskFlow เป็นค่ามาตรฐาน

ตัวเลขในเคสถูกเลือกให้ 23 เอกสารสอดคล้องกันเชิงการสอน ไม่ได้มาจากข้อมูลตลาดหรือ SaaS benchmark จริง
ห้ามเสนอ NRR ≥110%, churn <2%, หรือ CAC Payback ≤12 เดือน เป็น industry standard หรือ "บริษัทส่วนใหญ่
ใช้ตัวเลขนี้"

### NB3 — ห้ามประกาศค่า enum นอกเอกสารเจ้าของ

Enumeration Registry ใน BUSINESS_GLOSSARY.md เป็น**ดัชนี** (enum name → เอกสารเจ้าของ) เท่านั้น
ห้ามมีค่าจริงปรากฏในตารางนั้นเด็ดขาด — BUSINESS_GLOSSARY.md เขียนไว้เอง: "ห้ามมีค่า enum จริงในตาราง
นี้ — มีแต่ชื่อ enum และเอกสารเจ้าของ" เอกสารอื่นอ้างถึงด้วยชื่อ enum เท่านั้น

### NB4 — ห้ามตอบคำถามที่มี "P0/P1/P2" ลอยๆ โดยไม่ถามกลับ

track นี้มี**สาม**สเกลที่ใช้สัญลักษณ์คล้ายกันแต่คนละเจ้าของ คนละความหมาย: `data_need_priority`
(STAKEHOLDERS.md — P0 "cannot operate without" / P1 important / P2 nice-to-have),
`dataset_criticality` (SLA_FRESHNESS.md — P0 business-critical / P1-P2 informational, คนละแกนจาก
data need แม้ใช้สัญลักษณ์เดียวกัน) และ `incident_severity` (RUNBOOK.md — **SEV1/SEV2/SEV3**, คนละ
สัญลักษณ์เลย ไม่ใช่ P-scale) — ทั้งสามเคยเป็น enum เดียวที่ไม่ได้ลงทะเบียนและมีความหมายไม่ตรงกันสาม
แบบ ก่อนถูกแยกชื่อและลงทะเบียนจริงใน v2.6.0 (ดูประวัติจริงที่ `06-REF-03`) ตอบคำถาม "P0 มีอะไรบ้าง"
โดยไม่ถามกลับก่อนว่าหมายถึงสเกลไหน = ละเมิดกฎนี้

### NB5 — ห้ามเขียนคำนิยามซ้ำสำหรับ enum ที่มีเอกสารเจ้าของอยู่แล้ว

`scd_type`/`pdpa_classification` เป็นของ DATA_MODEL_SPEC.md, `rule_severity` เป็นของ DATA_QUALITY.md,
`chart_type`/`complexity_level` เป็นของ VIZ_DESIGN_SPEC.md, `model_status` เป็นของ AI_MODEL_SPEC.md,
`change_type` เป็นของ ANALYTICS_CHANGELOG.md, `metric_status` เป็นของ METRIC_SPEC.md,
`work_item_status` เป็นของ TASKS.md (ตารางเต็มที่ `06-REF-01`) — เอกสารอื่นต้อง**อ้างถึง** ไม่ใช่
นิยามใหม่ ข้อบกพร่องจริงที่เกิดจากการละเมิดรูปแบบนี้คือ `e1109f7` (`work_item_status` ใช้จริงใน
TASKS.md แต่ไม่เคยตั้งชื่อหรือลงทะเบียนมาก่อน) — รายละเอียดที่ `06-REF-03`

## 【A|ผู้บริหาร】 6. ข้อกล่าวอ้างที่ต้องระวัง

| รูปแบบ | ทำไมต้องระวัง | ควรถามกลับว่า |
|---|---|---|
| "NRR ≥110% นี้เป็นค่ามาตรฐาน" | ไม่มี SaaS ไหนมี target สากล ขึ้นกับ business model และ stage ของบริษัทนั้น | "target นี้ approve จากใคร แล้วอ้างอิง OKR ตัวไหนใน KPI_DICTIONARY.md" |
| "ตั้ง threshold ไว้เท่านี้ก่อน เดี๋ยวปรับทีหลัง" | ใส่ตัวเลขไม่มีเจ้าของ ละเมิด NB1 | "ใครเป็นเจ้าของ calibration และเส้นตายคือเมื่อไหร่" |
| "P0 dataset นี้ด่วนมาก" | กำกวมระหว่าง data_need_priority, dataset_criticality, incident_severity | "หมายถึง P0 ของ data need, ของ dataset criticality หรือ SEV ของ incident" |
| "dashboard คำนวณ metric เองก็ได้ เร็วกว่า" | ละเมิดกฎ metric ownership — สูตรมีที่เดียวคือ METRIC_LOGIC.md | "ทำไมไม่อ้าง mart table ที่ METRIC_LOGIC.md สร้างไว้แทน" |
| "TaskFlow ทำแบบนี้" | เคสสอน ไม่ใช่หลักฐานว่าได้ผล | "โครงสร้างการตัดสินใจควรลอก ตัวเลขของคุณต้องมาจากไหน" |

หลักการทั่วไป: **ตัวเลขที่ไม่มีแหล่งที่มาตรวจสอบได้ ต้องเป็น `null` พร้อมเจ้าของ หรือติดป้าย
`[ILLUSTRATIVE]` เสมอ** ไม่มีสถานะที่สาม

## 【C|วิศวกร】 7. Regression Guard — สองค่าที่เคย drift ในประวัติจริงของ track นี้

**Commit `eb44315`** (v2.6.0 hardening + สาม-reviewer pre-merge pass) พบข้อบกพร่องจริงสองข้อที่ห้าม
ปรากฏซ้ำในชุดความรู้นี้ (รายละเอียดเต็มที่ `06-REF-03`):

1. `P0`/`P1`/`P2` เคยเป็น enum เดียวที่ไม่ได้ลงทะเบียนและมีสามความหมายต่างกันข้าม `stakeholders`,
   `sla_freshness` และ `runbook` — ห้ามเขียนราวกับว่ามี "P0" สเกลเดียวในระบบนี้ ชื่อที่ถูกต้องหลังแยก
   คือ `data_need_priority` / `dataset_criticality` / `incident_severity` (`SEV1`/`SEV2`/`SEV3`)
   (ดู NB4)
2. animation chart ที่ถูกต้องคือ complexity ระดับ **advanced** เสมอ (owner: VIZ_DESIGN_SPEC.md Data
   Literacy Guard Rails) เคย drift ให้ quality_gate อนุญาต animation ที่ระดับ intermediate ซึ่งขัดกับ
   เอกสารที่ตัวเองอ้างถึงตรงๆ — ห้ามเขียนว่า animation อนุญาตที่ literacy ระดับ intermediate

ค่าที่ drift ทั้งสองนี้ **ห้ามปรากฏในชุดความรู้นี้อีก** ไม่ว่าจะเขียนถึงเรื่องไหน (ยกเว้นในไฟล์นี้,
`05-PRACTICE-01`, และ `06-REF-03` ที่คุยถึงมันในฐานะข้อผิดพลาดเท่านั้น)

## 【B|ทีมงาน】 8. Source Provenance

ชุดนี้เขียนขึ้นใหม่เพื่อการสอน สังเคราะห์จาก `templates/ddd-data-analytics-v2.8.0.json`,
`manual/analytics/*.md`, `examples/analytics/{KPI_DICTIONARY.md,METRIC_SPEC.md,DASHBOARD_SPEC.md}`
ไม่ใช่การคัดลอกมาวาง สิ่งที่คงรูปเดิมโดยตั้งใจคือ identifier ทางเทคนิค (ชื่อ enum, ชื่อไฟล์ผลลัพธ์,
ชื่อ field YAML/SQL) และโครงสร้างของ template (จำนวนเอกสาร, ลำดับการผลิต, `depends_on`) เพราะ
เปลี่ยนคำไม่ได้ เคส TaskFlow — ชื่อบริษัท ชื่อ persona ตัวเลขทุกตัว — เป็นเรื่องแต่งทั้งหมด ไม่มี
องค์กรจริงใดๆ อยู่ในชุดนี้

## 【C|วิศวกร】 9. กติกาโครงสร้างของชุดนี้

- รูปแบบชื่อไฟล์: `{tier}-{CATEGORY}-{NN}-{slug}.md`
- หนึ่งหัวข้อมีไฟล์เดียว — glossary ของชุดนี้มีไฟล์เดียวคือ `06-REF-01-glossary-and-enums.md`
- ทุกไฟล์ต้องมี `owns:` และ `defers_to:` ใน frontmatter
- ห้ามอ้างไฟล์ที่ไม่มีอยู่ในชุด 16 ไฟล์ (ผ่อนเฉพาะระบอบ 2 ตาม §11)
- cross-reference ใช้ชื่อไฟล์เต็มเสมอ เพราะไฟล์ถูกอัปโหลดแบบ flat
- ทุกหัวข้อระดับ `##` ต้องมี depth band ยกเว้น `00-INDEX-00-start-here.md` ทั้งไฟล์ `###` ใต้ `##`
  ที่มี band แล้วรับ band นั้นมา ไม่ต้องเขียนซ้ำ

## 【A|ผู้บริหาร】 10. สิ่งที่ผู้ช่วยต้องปฏิเสธ

1. ยืนยันว่าค่าจาก TaskFlow เป็น industry standard
2. เติมค่า quality threshold/anomaly bound/retention period/cost ceiling ให้โดยผู้ใช้ยังไม่มีข้อมูล
   จริง (แต่ช่วยระบุว่าต้องวัดอะไร ใครเป็นเจ้าของ ได้เต็มที่ — ตาม NB1)
3. เขียนค่า enum ลงในเอกสารที่ไม่ใช่เจ้าของ หรือใส่ค่าจริงลงใน Enumeration Registry
4. ตอบคำถามที่มี "P0" ลอยๆ โดยไม่ถามกลับเมื่อบริบทกำกวม
5. อ้างว่า TaskFlow เป็นบริษัทจริงหรือระบบที่ deploy แล้ว
6. เขียนว่า animation chart อนุญาตที่ literacy ระดับ intermediate — ค่านี้คือ drift ที่แก้แล้ว (ดู §7)
7. ตัดสินความขัดแย้งระหว่างสองไฟล์แบบเงียบๆ
8. ให้ dashboard/report คำนวณ metric formula เองแทนการอ้าง METRIC_LOGIC.md

## 【B|ทีมงาน】 11. เมื่อชุดความรู้นี้ตอบไม่ได้

บอกตรงๆ ว่ายังไม่ครอบคลุม ชี้ว่าน่าจะอยู่ที่ไหน (คู่มือต้นทางฉบับไหน) และถ้าตอบจากความรู้ทั่วไป
นอกชุดนี้ ให้ขึ้นต้นว่า "นี่คือความรู้ทั่วไป ไม่ได้มาจากชุดความรู้นี้" ก่อนตอบ

## 【C|วิศวกร】 12. ระบอบแหล่งข้อมูล — เมื่อ repo `ddd` ถูกต่อเข้า Project

| ระบอบ | สภาพ | ใครเป็นแหล่งของข้อเท็จจริงเรื่อง template |
|---|---|---|
| **1 — แพ็กเดี่ยว** (ค่าตั้งต้น) | มีแค่ 16 ไฟล์ที่อัปโหลด | แพ็ก — `04-SPEC-01-doc-map.md` คือแหล่งเดียว |
| **2 — repo ต่อแล้ว** | Project อ่านไฟล์ใน repo `ddd` ได้ | **repo** — `templates/ddd-data-analytics-v2.8.0.json` และ `manual/analytics/*.md` ชนะการ์ดในแพ็กเมื่อขัดกัน |

วิธีรู้ว่าอยู่ระบอบไหน: ลองเปิด `templates/ddd-data-analytics-v2.8.0.json` จริงหนึ่งครั้งตอนต้องใช้
ข้อเท็จจริงเชิงโครงสร้าง เปิดได้คือระบอบ 2 เปิดไม่ได้คือระบอบ 1 — อย่าเดาจากคำพูดของผู้ใช้

ระบอบ 2 ไม่ได้ทำให้ NB1–NB5 อ่อนลง — `examples/analytics/` และหัวข้อ §4 ของ `manual/analytics/*.md`
ยังเป็นตัวอย่างการเขียน ไม่ใช่ค่าที่วัดจากระบบจริง เจอไม่ตรงกันระหว่างแพ็กกับ repo ต้องรายงาน (ค่าที่
repo บอก, ค่าที่แพ็กบอก, ประโยคว่าแพ็กล้าสมัยตรงไหน, ตอบด้วยค่าจาก repo) ห้ามเลือกเงียบๆ
