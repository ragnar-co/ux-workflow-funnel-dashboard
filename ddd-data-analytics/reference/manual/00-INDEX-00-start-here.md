---
title: เริ่มที่นี่ — แผนที่ชุดความรู้ ddd-data-analytics
document_id: 00-INDEX-00-start-here
version: 1.0.0
created_at: 2026-09-22
audience: all
owns: [topic-map]
defers_to: []
---

# เริ่มที่นี่ — แผนที่ชุดความรู้ ddd-data-analytics

ชุดนี้สอนวิธีใช้ blueprint `ddd-data-analytics-v2.8.0` — template สำหรับวางแผน/สร้างเอกสารโครงการ
**analytics layer ที่วางบนระบบ operational ที่มีอยู่แล้ว** (KPI ที่ตกลงร่วมกัน, metric logic ที่คำนวณ
มัน, pipeline ที่ป้อนข้อมูลเข้า, dashboard/report ที่คนใช้ตัดสินใจ) จำนวน 23 ฉบับ ไฟล์ทั้งหมด 16 ไฟล์
ไม่ใช่คู่มือฉบับเต็มของ `manual/analytics/` แต่เป็นชั้นการสอนที่สังเคราะห์และชี้ทาง (ดู authority
model ใน `01-GOV-01`)

track นี้แชร์ `meta.version` กับ `ddd-web-app` (ทั้งคู่อยู่ที่ v2.8.0 ตอนนี้) และมี
`agent_hints.optional_integrations` สองจุดที่โยงเข้าฝั่ง web-app — ดูรายละเอียดที่ `02-CORE-01`
§"Optional Integrations"

## หาอะไร ไปไฟล์ไหน

| ต้องการ | ไปที่ |
|---|---|
| กฎการอ้างอิง ป้ายสถานะ ข้อห้าม | `01-GOV-01-authority-truth-and-claims.md` |
| template นี้คืออะไร ต่างจาก web-app/postgresql-design/ai-chatbot ยังไง เมื่อไหร่ไม่ควรใช้ | `02-CORE-01-what-this-template-is.md` |
| distinction ที่คนมักปนกัน (KPI/metric/dimension, freshness/completeness/correctness, ...) | `02-CORE-02-distinctions-and-doctrines.md` |
| วิธีเขียนเอกสาร Business Layer (stakeholders ... metric_spec) | `03-PHASE-01-business-layer.md` |
| วิธีเขียนเอกสาร Analytics Layer (data_model_spec, metric_logic, data_contract) | `03-PHASE-02-analytics-layer.md` |
| วิธีเขียนเอกสาร Data Engineering Layer (pipeline_spec ... testing_strategy) | `03-PHASE-03-engineering-layer.md` |
| วิธีเขียนเอกสาร Analytics Output Layer (viz_design_spec, dashboard_spec, report_spec) | `03-PHASE-04-output-layer.md` |
| วิธีเขียนเอกสาร Governance & AI Layer (data_governance ... readme) | `03-PHASE-05-governance-and-ai-layer.md` |
| การ์ดทุกเอกสาร, `depends_on`, ลำดับผลิต, ขั้นตอนผลิตเอกสารจริงอย่างปลอดภัย | `04-SPEC-01-doc-map.md` |
| แบบฝึกหัด (มีตัวอย่างที่ตั้งใจผิด) | `05-PRACTICE-01-exercises-and-labs.md` |
| readiness gate 6 ชุด 34 item เต็ม | `05-PRACTICE-02-checklists-gates-and-validation.md` |
| คำถามที่พบบ่อย | `05-PRACTICE-03-faq-and-misconceptions.md` |
| enum registry, ID format ทั้งหมด | `06-REF-01-glossary-and-enums.md` |
| เคสตัวอย่าง TaskFlow Data Platform (ตัวเลขสอนล้วน) | `06-REF-02-case-taskflow-data-platform.md` |
| ข้อบกพร่องจริงในประวัติ track นี้ | `06-REF-03-lessons-from-real-defects.md` |

## เริ่มต้นเร็วที่สุด

1. อ่าน `01-GOV-01` ก่อนเสมอ (กติกาความน่าเชื่อถือ)
2. อ่าน `02-CORE-01` เพื่อรู้ว่า template นี้ใช้เมื่อไหร่
3. ถ้าจะผลิตเอกสารจริง ไปที่ `04-SPEC-01` แล้วทำตาม Production Protocol
