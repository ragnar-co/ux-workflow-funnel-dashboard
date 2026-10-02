---
title: แบบฝึกหัด
document_id: 05-PRACTICE-01-exercises-and-labs
version: 1.0.0
created_at: 2026-09-22
audience: all
owns: [exercises]
defers_to: [02-CORE-02-distinctions-and-doctrines.md, 06-REF-03-lessons-from-real-defects.md]
---

# แบบฝึกหัด

ไฟล์นี้มีตัวอย่างที่ **ตั้งใจผิด** เพื่อฝึกจับ — ห้ามใช้เป็นข้อมูลอ้างอิงจริง (ดู `01-GOV-01` §8)

## 【C|วิศวกร】 แบบฝึกหัด 1 — จับ "P0" ที่กำกวม

โจทย์: ทีมส่งข้อความมาว่า "P0 dataset นี้ต้องแก้ก่อนเลย" โดยไม่บอกบริบท

✗ ตอบทันทีว่า "โอเค เดี๋ยวจัดลำดับให้"

✓ ถามกลับก่อนว่าหมายถึง `data_need_priority` (STAKEHOLDERS.md, cannot operate without),
`dataset_criticality` (SLA_FRESHNESS.md, business-critical แต่คนละแกนจาก data need) หรือ
`incident_severity` (RUNBOOK.md — จริงๆ ใช้ SEV1/SEV2/SEV3 ไม่ใช่ P-scale เลย) เพราะคนที่ต้อง
escalate หาแตกต่างกันโดยสิ้นเชิง (ดู NB4 ใน `01-GOV-01`, ข้อบกพร่องจริงที่ `06-REF-03`)

## 【B|ทีมงาน】 แบบฝึกหัด 2 — จับ dependency gap

โจทย์: ผู้ใช้ขอ "ช่วยเขียน METRIC_LOGIC.md ให้หน่อย" โดยยังไม่มี DATA_MODEL_SPEC.md ให้เลย

✗ เขียน METRIC_LOGIC.md เต็มโดยสมมติชื่อ fact table และ column ขึ้นมาเอง

✓ ตรวจ `depends_on` ของ `metric_logic` ใน `04-SPEC-01-doc-map.md` (= metric_spec, data_model_spec)
พบว่า data_model_spec ยังไม่มี → หยุด แจ้งว่าต้องมีฉบับนี้ก่อน ตาม Production Protocol — เขียน SQL
โดยเดาชื่อ table เองจะได้เอกสารที่ "ดูครบ" แต่ query ไม่มี table จริงรองรับเลย

## 【D|Data-Governance】 แบบฝึกหัด 3 — จับตัวเลขไม่มีเจ้าของ

โจทย์: ผู้ใช้ร่าง DATA_QUALITY.md แล้วเขียนว่า "anomaly bound = 3 standard deviations (ค่ามาตรฐานที่
ทีม analytics ส่วนใหญ่ใช้กัน)"

✗ ปล่อยผ่าน เพราะตัวเลขดูสมเหตุสมผลและเป็นค่าที่คุ้นตา

✓ ชี้ว่าละเมิด NB1 — ต้องเป็น `null` พร้อม calibration owner หรือมีแหล่งอ้างอิงจริงจากข้อมูล
production เท่านั้น "ค่ามาตรฐานที่ทีมส่วนใหญ่ใช้" ไม่ใช่แหล่งอ้างอิงที่ตรวจสอบได้ — นี่คือ invented
default ที่ review จริงของ track นี้เคยจับได้ (ดู `06-REF-03`) ตัวอย่างที่ถูก: "anomaly bound = `null`
— calibration owner: Analytics Engineer หลังมีข้อมูล 90 วันย้อนหลัง"

## 【B|ทีมงาน】 แบบฝึกหัด 4 — จับการนิยามซ้ำของ enum

โจทย์: ร่าง DASHBOARD_SPEC.md เขียนว่า "chart type แบ่งเป็น line, bar, donut, heatmap" แล้วมีคนเสนอให้
copy รายการนี้ไปแปะไว้ใน BUSINESS_GLOSSARY.md's Enumeration Registry ด้วย "เผื่อคนหาเจอเร็วขึ้น"

✗ ทำตาม เพราะฟังดูสะดวกสำหรับผู้อ่าน

✓ ชี้ว่าละเมิด NB3 — Enumeration Registry เป็น**ดัชนี** (enum name → เอกสารเจ้าของ) เท่านั้น ห้ามมีค่า
จริงปรากฏ ไม่ว่าจะด้วยเหตุผลอะไร ถ้าเพิ่มค่าจริงเข้าไปแล้ว VIZ_DESIGN_SPEC.md (เจ้าของจริงของ
`chart_type`) แก้ค่าในอนาคต glossary จะไม่ sync ตาม — สองแหล่งความจริงที่ไม่ตรงกันคือปัญหาที่
registry มีไว้ป้องกัน (ดูบทเรียนจริงที่ใกล้เคียงคือ `e1109f7` ที่ `06-REF-03`)

## 【C|วิศวกร】 แบบฝึกหัด 5 — จับ grain ที่คลุมเครือ

โจทย์: METRIC_SPEC.md เขียน grain ของ metric ใหม่ว่า `"monthly"` เฉยๆ

✗ ปล่อยผ่าน เพราะดูเหมือนบอกความถี่ครบแล้ว

✓ ชี้ว่า grain ต้องตอบว่า "1 row แทนอะไร" ในรูปแบบ `1 [entity] × 1 [time_unit]` เช่น
`1 customer × 1 calendar month` — "monthly" เฉยๆ ไม่บอกว่าเป็นต่อ customer หรือต่อ organization ถ้า
1 organization มีหลาย customer การ aggregate จะต่างกันและ join ตรงๆ ไม่ได้ (ดู `02-CORE-01`
เอกสารเจ้าของ `data_model_spec` §"grain ที่พลาดบ่อยที่สุด")

## 【D|Data-Governance】 แบบฝึกหัด 6 — จับค่าที่ drift กลับมา

โจทย์: มีคนถามว่า "animation chart ใช้กับ dashboard ที่ audience literacy ระดับ intermediate ได้
ใช่ไหม ผมจำได้แบบนั้น"

✗ ยืนยันตามที่ผู้ใช้จำมา เพราะฟังดูมั่นใจ

✓ แก้ให้ตรง — animation คือ complexity ระดับ **advanced** เสมอ (เจ้าของ: VIZ_DESIGN_SPEC.md Data
Literacy Guard Rails) ค่าที่ผู้ใช้จำมาเป็นค่าที่เคย**drift**เข้ามาจริงในtemplateเวอร์ชันก่อนแก้ (commit
`eb44315`) ก่อน quality_gate จะถูกแก้ให้ตรงกับ viz_design_spec — ไม่ใช่ค่าที่ถูกต้องไม่ว่าจำมาจากไหน
(ดู `01-GOV-01` §7 และ `06-REF-03`)
