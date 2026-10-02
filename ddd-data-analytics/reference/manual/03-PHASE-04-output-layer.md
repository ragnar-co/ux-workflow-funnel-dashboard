---
title: Analytics Output Layer — Consumption (3 เอกสาร)
document_id: 03-PHASE-04-output-layer
version: 1.0.0
created_at: 2026-09-22
audience: all
owns: [phase-output-howto]
defers_to: [02-CORE-01-what-this-template-is.md, 04-SPEC-01-doc-map.md]
---

# Analytics Output Layer — Consumption

ลำดับผลิต: `viz_design_spec` → `dashboard_spec` → `report_spec` (viz_design_spec ต้องรอ stakeholders
+ metric_spec, dashboard_spec ต้องรอ 6 ฉบับรวม viz_design_spec, report_spec ต้องรอ dashboard_spec
เป็นหลัก)

## 【C|วิศวกร】 viz_design_spec — VIZ_DESIGN_SPEC.md (depends_on: [stakeholders, metric_spec])

ห้าหัวข้อบังคับ: Chart Type Matrix, Color & Theme Spec, Interaction Spec, Accessibility Guidelines,
Data Literacy Guard Rails — เอกสารนี้เป็นเจ้าของ `chart_type` และ `complexity_level` enum ทั้งคู่
Chart Type Matrix ต้อง cross-check ครบทุก metric type ใน METRIC_SPEC.md และ anti-pattern column
ต้องอ้างจาก `references/data-to-viz/data-to-viz-*.md` จริง ไม่ใช่จากความจำ

**Color & Theme Spec ต้องมี `viz_theme` เป็น fenced Python code block ในเอกสารนี้** (ไม่ใช่ไฟล์แยก —
schema ของ template อนุญาตเฉพาะ `.md` ต่อเอกสาร) export `COLOR_PALETTE`, `FONT_RULES`,
`CHART_DEFAULTS` ครบ 3 keys ให้ dashboard code คัดลอกไปเป็น `viz_theme.py` ของตัวเอง — นี่คือจุดที่
เคย drift จริง (มี fix ครึ่งเดียว: instruction บอกว่าเป็น fenced block แต่ section item ยังขอไฟล์
แยกอยู่) ดูรายละเอียดที่ `06-REF-03`

**Data Literacy Guard Rails คือเรื่องความถูกต้อง ไม่ใช่ความสวยงาม** — chart ที่ซับซ้อนเกินระดับผู้อ่าน
ไม่ได้แค่อ่านยาก แต่ทำให้ตัดสินใจผิด เพราะผู้อ่านตีความสิ่งที่คุ้นเคยที่สุดในภาพแทนสิ่งที่ภาพบอกจริง
3 ระดับ: Basic (bar/line/KPI card/table) → Intermediate (+ heatmap, scatter, grouped bar, pie/donut)
→ **Advanced (+ multi-axis, animated, custom viz, Sankey)** — animation คือ Advanced เสมอ **ห้าม
เขียนว่า animation อนุญาตที่ literacy ระดับ intermediate** (ค่านี้เคย drift มาก่อน ดู regression
guard ที่ `01-GOV-01` §7) gate rule ห้ามใช้ complexity สูงกว่า `data_literacy_level` ของ audience —
override ต้องมี sign-off จาก audience group เอง + training plan + บันทึกใน ANALYTICS_CHANGELOG.md

## 【A|ผู้บริหาร】 dashboard_spec — DASHBOARD_SPEC.md (depends_on: [metric_spec, kpi_dictionary, data_model_spec, stakeholders, testing_strategy, viz_design_spec])

ห้าหัวข้อบังคับ: Dashboard Inventory, Dashboard Profiles, Metric Coverage Matrix, Drill-down Logic,
Refresh Schedule — **กฎสำคัญ:** ทุก KPI ใน KPI_DICTIONARY.md ต้องปรากฏใน dashboard อย่างน้อย 1 อัน —
KPI ที่ไม่ปรากฏบน dashboard ไหนเลยคือ KPI ที่ไม่มีใครดู ต่อให้ pipeline คำนวณทุกคืน Metric Coverage
Matrix คือที่เดียวที่ทำให้ช่องว่างระหว่าง "วัดได้" กับ "มีคนดูจริง" มองเห็นได้ — metric name ต้อง
ตรงกับ METRIC_SPEC.md เป๊ะ ห้ามใช้ alias (เช่น dashboard เขียน "Monthly Revenue" แต่ METRIC_SPEC
เรียก "MRR")

Dashboard Profiles ต้องมี **chart inventory** ต่อ dashboard (metric, chart type, แถวใน
chart_type_matrix ที่รองรับ) และ **acceptance criteria** ตาม dashboard_acceptance_tests ใน
TESTING_STRATEGY.md — quality gate ตรวจ chart type อยู่แล้วแต่ก่อนหน้านี้ไม่มี section ไหนบันทึก
chart เลย (ดูข้อบกพร่องจริงที่ `06-REF-03`) Refresh Schedule ต้องมี **performance budget** ด้วย —
dashboard ที่โหลด 40 วินาทีคือ dashboard ที่ไม่มีใครเปิดตอนประชุม

## 【A|ผู้บริหาร】 report_spec — REPORT_SPEC.md (depends_on: [dashboard_spec, kpi_dictionary, metric_spec, stakeholders, sla_freshness])

สี่หัวข้อบังคับ: Report Profiles, KPI Coverage, Distribution Schedule, Template Definitions —
**Report ≠ Dashboard**: report เป็น static snapshot ที่ push ให้ผู้รับอัตโนมัติตาม cadence (PDF,
email HTML, Excel) ต่างจาก dashboard ที่เป็น interactive real-time ที่ user เข้าดูเอง KPI Coverage
Matrix ตรวจแบบเดียวกับ Dashboard Coverage — ทุก KPI ต้องมี report ครอบคลุม ≥1 ฉบับ (missing coverage
ต้องมี justification ถ้าตั้งใจ exclude) **Deadline ต้องมาหลัง data availability ใน
SLA_FRESHNESS.md เสมอ** — report ที่ deadline มาก่อนข้อมูลพร้อมคือ report ที่ส่งข้อมูลไม่ครบ ทุก
report ต้องระบุว่าเกิดอะไรขึ้นเมื่อพลาด deadline — report ที่ไม่มีผลตามมาเมื่อส่งช้าจะกลายเป็นรายงาน
ที่ส่งช้าเป็นปกติ
