---
title: ddd-data-analytics คืออะไร และเจ้าของแต่ละ enum
document_id: 02-CORE-01-what-this-template-is
version: 1.0.0
created_at: 2026-09-22
audience: all
owns: [what-this-template-is, when-not-to-use, canonical-ownership-table, neighbor-comparison, optional-integrations]
defers_to: [01-GOV-01-authority-truth-and-claims.md]
---

# ddd-data-analytics คืออะไร

`ddd-data-analytics-v2.8.0` เป็นหนึ่งในสิบ DDD blueprint ของ repo `ddd` — agent อ่าน blueprint นี้แล้ว
ผลิตเอกสารโครงการ 23 ฉบับตามลำดับ `meta.generation_order` เพื่อวางแผน/สร้าง **analytics layer ที่
วางบนระบบ operational ที่มีอยู่แล้ว** — นี่คือคำนิยาม `applicable_when` ของ template เองคำต่อคำ:
"Building the analytics layer over an existing operational system — a shared KPI definition, the
metric logic that computes it, the pipelines that feed it, and the dashboards and reports people act
on. ... This template assumes a warehouse-and-BI stack, not a streaming-first one."

## 【A|ผู้บริหาร】 เมื่อไหร่ควรใช้ — และเมื่อไหร่ไม่ควร

**ใช้เมื่อ:** งานคือ KPI/metric ที่ทีมต้องตกลงนิยามร่วมกัน, pipeline ที่ป้อน warehouse, และ
dashboard/report ที่คนใช้ตัดสินใจ — สมมติฐานคือ **warehouse-and-BI stack** (BigQuery/Snowflake +
dbt + Looker/Zoho Analytics เป็นต้น) ไม่ใช่ streaming-first architecture

**ห้ามใช้เมื่อ:** งานคือ**schema ของฐานข้อมูล operational เอง** — นั่นคือ `ddd-postgresql-design`
template (`applicable_when`): "specifies the PostgreSQL schema itself rather than the metrics
computed over it" หรืองานคือ**เว็บ/แอปที่มี event tracking** — นั่นคือ `ddd-web-app` template ซึ่ง
`TRACKING_PLAN.md` เป็น **declared upstream producer** ของ event ที่ track นี้บริโภคผ่าน
`PIPELINE_SPEC.md`'s `source_systems` และ `DATA_CONTRACT.md`'s `upstream_event_contract` (ดูหัวข้อ
ถัดไปเรื่อง track ที่ต่อได้แบบทางการ) หรืองานคือ**recurring generated artifact จาก LLM** (brief, report
ที่ agent เขียน) — นั่นคือ `ddd-ai-workflow` template ซึ่ง "produces a recurring generated artifact
rather than a governed metrics layer"

## 【A|ผู้บริหาร】 Optional Integrations — self-contained + ต่อได้แบบทางการ 3 จุด

data-analytics ยังคง**self-contained เต็มรูป** — ผลิตครบ 23 เอกสารได้โดยไม่ต้องพึ่ง track ไหนเลย แต่
มี 3 จุดที่ประกาศไว้เป็นทางการผ่าน schema field `agent_hints.optional_integrations`
(`ddd-schema.json`, ใช้ร่วมกันได้ทุก template) แต่ละจุดคือการ machine-encode ความสัมพันธ์ที่
`applicable_when` เขียนไว้เป็น prose อยู่แล้ว **field นี้ไม่ใช่ `depends_on`** — ไม่เข้า
`meta.generation_order`, ไม่ gate การผลิตเอกสาร, ไม่บังคับให้ track ปลายทางมีอยู่จริงในโปรเจกต์

| เอกสาร | ต่อกับ | ทิศทาง | ไฟล์ปลายทาง | ใช้ทำอะไร | เจ้าของค่ายังเป็นใคร |
|---|---|---|---|---|---|
| DATA_CONTRACT.md | web-app | consumes | TRACKING_PLAN.md | Upstream Event Contract section อาจรับ event name จาก TRACKING_PLAN.md แทน producer ที่ไม่ระบุ | TRACKING_PLAN.md ยังเป็นเจ้าของ `event_name` enum และทุกค่าของมัน — DATA_CONTRACT.md เป็นเจ้าของแค่ `event_schema_version` ที่ตัวเองตั้งตอน ingest ครั้งแรก เพราะ TRACKING_PLAN.md ไม่มี schema_version ของตัวเอง |
| PIPELINE_SPEC.md | web-app | consumes | TRACKING_PLAN.md | source system ของ pipeline อาจเป็น event-stream ingest จาก TRACKING_PLAN.md แทน source ที่ไม่ระบุ | TRACKING_PLAN.md ยังเป็นเจ้าของ `event_name` enum และ schema ของทุก event — เอกสารนี้แค่ ingest/route ไม่เคยนิยามความหมายของ event ใหม่ หรือเพิ่มค่าใน enum |
| DASHBOARD_SPEC.md | ai-chatbot | consumes | EVALUATION.md | metric ของ dashboard อาจมาจาก Online Conversation Analytics events ของ EVALUATION.md (containment, CSAT, handoff rate) แทน source ที่ไม่ระบุ | EVALUATION.md ยังเป็นเจ้าของนิยาม/สูตร/target ของทุก KPI — DASHBOARD_SPEC.md แค่ visualize ไม่เคยนิยาม event ใหม่ |

**Exchange seam ไม่ใช่ ownership transfer** — ทุกแถว: track ภายนอกให้ข้อมูล/event แต่ไม่รับหรือได้
สิทธิ์ความเป็นเจ้าของอะไรของ data-analytics ไปเลย เอกสารฝั่งขวายังเป็นแหล่งความจริงเดียวของ contract
ของตัวเองเสมอ — กฎนี้เขียนไว้ตรงๆ ทั้งในทุก `description` ของ field และในระดับ schema เอง

**ตรวจได้จริง:** `tools/test_comprehensive.py` T23 ยืนยันทุก entry (ทั้ง 10 template รวมกัน) ชี้ track
ที่มีจริงและไฟล์ที่มีจริงใน `manual/<track>/`, ไม่มี description ไหนใช้คำที่สื่อว่า track ภายนอก
"automatically fill/set/populate/configure" ค่า, และ `depends_on` ของทุกเอกสารต้องไม่มี track slug
ปนเลย — แต่ไม่มีอะไรบังคับให้ต้องใช้ entry ไหนเลย (ทุก description บอกตรงๆ ว่า "Optional: ...
complete without it")

## 【B|ทีมงาน】 Canonical Ownership Table

ตารางนี้คัดลอกจาก `BUSINESS_GLOSSARY.md`'s `agent_hints.input_context` ของ template เอง (ไม่ใช่จาก
"ตัวอย่างที่ดี" ใน manual — ตัวอย่างในนั้นเขียนก่อน v2.6.0 แยกสาม P-scale ออกจากกัน จึงเก่ากว่า
ตารางนี้ 3 แถว) ชื่อ enum + เอกสารเจ้าของเท่านั้น ไม่มีค่าจริง ตาม NB3 ใน `01-GOV-01` — รายละเอียด
รูปร่างของค่าอยู่ที่ `06-REF-01-glossary-and-enums.md`

| `enum name` | เอกสารเจ้าของ |
|---|---|
| `data_literacy_level` | STAKEHOLDERS.md |
| `data_need_priority` | STAKEHOLDERS.md |
| `scd_type` | DATA_MODEL_SPEC.md |
| `pdpa_classification` | DATA_MODEL_SPEC.md |
| `rule_severity` | DATA_QUALITY.md |
| `dataset_criticality` | SLA_FRESHNESS.md |
| `chart_type` | VIZ_DESIGN_SPEC.md |
| `complexity_level` | VIZ_DESIGN_SPEC.md |
| `metric_status` | METRIC_SPEC.md |
| `model_status` | AI_MODEL_SPEC.md |
| `work_item_status` | TASKS.md |
| `incident_severity` | RUNBOOK.md |
| `change_type` | ANALYTICS_CHANGELOG.md |

13 enum ข้าม 10 เอกสารเจ้าของ — ตรวจนับได้จาก `BUSINESS_GLOSSARY.md`'s `agent_hints.input_context`
ในตัว template โดยตรง (ระบอบ 2 ใน `01-GOV-01` §12)

## 【B|ทีมงาน】 5 Phase ของ template นี้

| Phase | เอกสาร (5/3/4/3/8) | สิ่งที่ phase นี้ตัดสิน |
|---|---|---|
| `phase_business` | stakeholders, constraints, kpi_dictionary, business_glossary, metric_spec | ใครต้องการรู้อะไร ภายใต้ข้อจำกัดอะไร วัดผลสำเร็จด้วย KPI/metric ตัวไหน |
| `phase_analytics` | data_model_spec, metric_logic, data_contract | metric คำนวณจากตารางไหน SQL อย่างไร สัญญากับ producer คืออะไร |
| `phase_engineering` | pipeline_spec, data_quality, sla_freshness, testing_strategy | ข้อมูลไหลมาอย่างไร สดแค่ไหน ถูกต้องแค่ไหน ทดสอบอย่างไรก่อน deploy |
| `phase_output` | viz_design_spec, dashboard_spec, report_spec | แสดงผลด้วย chart อะไร ใครดู dashboard/report ไหน |
| `phase_governance` | data_governance, agents_md, tasks, lineage, ai_model_spec, runbook, analytics_changelog, readme | ใครเข้าถึงข้อมูลได้ PII จัดการยังไง เกิด incident แล้วทำอะไร |

รายละเอียดวิธีเขียนแต่ละเอกสารอยู่ที่ `03-PHASE-01` ถึง `03-PHASE-05` การ์ดสรุปทุกเอกสารอยู่ที่
`04-SPEC-01-doc-map.md`

## 【C|วิศวกร】 เทียบกับ track ใกล้เคียง — ใครเป็นเจ้าของอะไร

| แนวคิด | data-analytics | postgresql-design | web-app |
|---|---|---|---|
| นิยาม schema ของฐานข้อมูล operational | ไม่ทำ — อ่านผ่าน pipeline เท่านั้น | ทำ — เจ้าของ schema จริง | ทำ (DATA_MODEL.md) — schema ของแอป ไม่ใช่ analytics warehouse |
| นิยาม metric/KPI ที่ธุรกิจใช้ตัดสินใจ | ทำ — เจ้าของ (KPI_DICTIONARY.md, METRIC_SPEC.md) | ไม่ทำ | ไม่ทำ |
| นิยาม event ที่ user ทำในแอป | ไม่ทำ — บริโภคผ่าน optional integration | ไม่ทำ | ทำ — เจ้าของ (TRACKING_PLAN.md) |
| dashboard/report สำหรับผู้บริหาร | ทำ — เจ้าของ (DASHBOARD_SPEC.md, REPORT_SPEC.md) | ไม่ทำ | ไม่ทำ |

ตารางนี้เป็นการตีความของผู้เขียนแพ็ก สร้างจากการอ่าน `applicable_when` ของทั้งสาม template
ประกอบกัน — ไม่ใช่ข้อความคัดลอกตรงจาก template เดียว
