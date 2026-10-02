---
title: Distinctions ที่พิสูจน์แล้วของ data-analytics
document_id: 02-CORE-02-distinctions-and-doctrines
version: 1.0.0
created_at: 2026-09-22
audience: all
owns: [proven-distinctions]
defers_to: [01-GOV-01-authority-truth-and-claims.md]
---

# Distinctions ที่พิสูจน์แล้วของ data-analytics

ทุกหัวข้อในไฟล์นี้คือ `agent_instructions.domain_specific_notes` ของ
`templates/ddd-data-analytics-v2.8.0.json` เอง — คัดลอกคำต่อคำ ไม่มี distinction ไหนถูกคิดขึ้นเพื่อให้
ไฟล์นี้ดูครบ (ดู NB5 ใน `01-GOV-01`) `06-REF-01-glossary-and-enums.md` เก็บ enum name → owner
เท่านั้น ไฟล์นี้เก็บ **เหตุผลว่าทำไมสองสิ่งที่ดูคล้ายกันไม่ใช่สิ่งเดียวกัน** — เก้าเรื่องนี้เป็น
`domain_specific_notes` ทั้งหมดที่ template ประกาศไว้ (ครบตามจำนวนจริง ไม่ตัดทอน)

## 【A|ผู้บริหาร】 1. KPI ≠ metric ≠ dimension

> "a KPI is the business outcome someone is accountable for (KPI_DICTIONARY.md), a metric is a
> specific computed number that moves it (METRIC_SPEC.md), and a dimension is what you slice either
> one by (DATA_MODEL_SPEC.md). A metric with no parent KPI measures something nobody owns; a
> dimension promoted to a metric produces a number with no formula."

| | KPI | Metric | Dimension |
|---|---|---|---|
| เจ้าของ | KPI_DICTIONARY.md | METRIC_SPEC.md | DATA_MODEL_SPEC.md |
| คืออะไร | ผลลัพธ์ทางธุรกิจที่มีคนรับผิดชอบ (มี owner, target, escalation path) | ตัวเลขที่ขยับ KPI นั้น (มี formula, grain, threshold) | สิ่งที่ใช้ slice ข้อมูล (plan_tier, region, cohort) |
| ตัวอย่าง TaskFlow | NRR ≥110% (VP of Revenue) | MRR Churn Rate (Revenue Analytics Team) | plan_tier, customer_region |

metric ที่ไม่มี `parent_kpi` วัดสิ่งที่ไม่มีใครเป็นเจ้าของ; dimension ที่ถูกเลื่อนขั้นเป็น metric
(เช่นนับ `plan_tier` เป็นตัวเลข) จะได้ตัวเลขที่ไม่มีสูตรรองรับ

## 【C|วิศวกร】 2. Freshness ≠ completeness ≠ correctness

> "freshness is whether the data arrived on time (SLA_FRESHNESS.md), completeness is whether all
> the rows that should exist do (DATA_QUALITY.md), and correctness is whether the computed number
> is right (TESTING_STRATEGY.md metric validation). A dashboard can be perfectly fresh, perfectly
> complete and still wrong, and each failure needs a different alert and a different owner."

| | Freshness | Completeness | Correctness |
|---|---|---|---|
| เจ้าของ | SLA_FRESHNESS.md | DATA_QUALITY.md | TESTING_STRATEGY.md (metric validation) |
| ตอบคำถาม | ข้อมูลมาตรงเวลาไหม | แถวที่ควรมีอยู่ครบไหม | ตัวเลขที่คำนวณออกมาถูกไหม |
| alert คนละตัว | delay-tolerance breach | null-rate/row-count anomaly | golden-dataset mismatch |

dashboard ที่สดและครบ**ยังผิดได้** — สามอย่างนี้ต้องมี alert คนละตัวและเจ้าของคนละคน ยุบรวมเป็น
"data quality" คำเดียวทำให้ debug ผิดจุด

## 【C|วิศวกร】 3. Data contract ≠ quality rule ≠ test

> "the contract is the agreement with the producer about what they will send (DATA_CONTRACT.md), a
> quality rule is what we check on arrival and how the pipeline reacts (DATA_QUALITY.md), and a
> test is what runs in CI against known inputs (TESTING_STRATEGY.md). Collapsing them means a
> producer breaking the contract looks identical to our own transformation breaking."

| | Data contract | Quality rule | Test |
|---|---|---|---|
| เจ้าของ | DATA_CONTRACT.md | DATA_QUALITY.md | TESTING_STRATEGY.md |
| คือข้อตกลงกับ | producer (ทีมนอก analytics) | ข้อมูลที่มาถึงจริง | known input ใน CI |
| ตรวจตอนไหน | ก่อน ingest (SLA/schema) | ระหว่าง pipeline รัน | ก่อน deploy |

ยุบสามอย่างนี้ทำให้ "producer เปลี่ยน schema โดยไม่แจ้ง" หน้าตาเหมือนกับ "transformation logic ของ
เราเองพัง" — ทั้งที่ต้องแก้คนละจุดและแจ้งคนละคน

## 【C|วิศวกร】 4. Lineage ≠ impact analysis ≠ changelog

> "lineage records where a number came from, impact analysis answers what breaks if an upstream
> thing changes, and the changelog records what actually changed and when. LINEAGE.md owns the
> first two and ANALYTICS_CHANGELOG.md the third; a lineage graph with no changelog cannot explain
> why yesterday's number differs from today's."

| | Lineage | Impact Analysis | Changelog |
|---|---|---|---|
| เจ้าของ | LINEAGE.md | LINEAGE.md | ANALYTICS_CHANGELOG.md |
| ทิศทาง | ย้อนกลับ (metric → source) | ไปข้างหน้า (source เปลี่ยน → อะไรพัง) | บันทึกสิ่งที่เกิดขึ้นจริง + เมื่อไหร่ |

มี lineage โดยไม่มี changelog อธิบายได้แค่ "ตัวเลขมาจากไหน" แต่อธิบายไม่ได้ว่า "ทำไมตัวเลขเมื่อวาน
กับวันนี้ต่างกัน" — สอง capability คนละงาน แม้จะดูเหมือนกันเพราะทั้งคู่พูดถึง "อดีต"

## 【B|ทีมงาน】 5. Business Glossary คือ naming authority

> "A term defined in BUSINESS_GLOSSARY.md determines the metric name in METRIC_SPEC.md, the column
> name in DATA_MODEL_SPEC.md and the label on the dashboard. When they disagree, the glossary wins
> and the others are corrected."

BUSINESS_GLOSSARY.md ไม่ใช่แค่ dictionary อ้างอิง — เป็น**เจ้าของสุดท้าย**ของชื่อ เมื่อ METRIC_SPEC.md
ตั้งชื่อ metric ว่า "Churn Rate" แต่ dashboard แสดง label "Cancellation Rate" ผู้แพ้คือ dashboard
ไม่ใช่ glossary การแก้ที่ถูกต้องคือแก้ dashboard label ให้ตรง glossary ไม่ใช่เพิ่ม disputed term ใหม่

## 【A|ผู้บริหาร】 6. การเปลี่ยนนิยาม metric คือ breaking change เสมอ

> "Restating a number that has already been reported is not a bug fix — it needs a changelog entry,
> a stated effective date, and a decision about whether history is restated or the old definition
> is kept alongside. ANALYTICS_CHANGELOG.md owns that record."

เปลี่ยนสูตร churn rate จาก customer-count-weighted เป็น revenue-weighted ไม่ใช่การ "แก้บั๊ก" แม้ทีม
จะคิดว่าสูตรใหม่ถูกกว่า — ต้องมี `effective_date`, ต้องตัดสินว่า historical data จะ recalculate
ย้อนหลังหรือคงสูตรเก่าไว้คู่กัน และต้องผ่าน `DATA_CONTRACT.md`'s breaking-change notice period ก่อน
consumer ทุกคนจะยังเชื่อตัวเลขที่เห็น

## 【D|Data-Governance】 7. PDPA คือกรอบ compliance ตลอดทั้ง template นี้ ไม่ใช่ GDPR

> "Personal data reaches the warehouse through pipelines, survives in extracts, dashboards, and
> model training sets, and an erasure request must reach all of them — not only the source table."

คำขอลบข้อมูลตาม PDPA ที่ลบแค่ตาราง source แล้วถือว่าเสร็จ **ไม่เสร็จจริง** — ต้องไล่ลบ/anonymize
ทุกชั้น: source table → staging → mart → extract → dashboard cache → model training set → cold-
storage archive (ดูรายละเอียดขั้นตอนจริงที่ `03-PHASE-05` §RUNBOOK.md Retention Enforcement)

## 【B|ทีมงาน】 8. ทุก KPI ต้องคำนวณได้จากข้อมูลที่มาถึงจริง

> "A KPI whose inputs no pipeline produces is an aspiration, not a measurement — the coverage check
> belongs in the readiness gates, not in a later conversation."

KPI_DICTIONARY.md เขียน KPI ไว้ได้ก่อนมี pipeline ใดๆ เลย (เป็น root document ไม่มี `depends_on`)
แต่ก่อน go-live ทุก KPI ต้อง traceable กลับไปหา pipeline ที่ผลิตข้อมูลป้อนมันจริง — coverage check
นี้อยู่ใน readiness gate (`05-PRACTICE-02`) ไม่ใช่สิ่งที่รอไปคุยทีหลังตอน dashboard สร้างเสร็จแล้ว

## 【D|Data-Governance】 9. งบสร้างครั้งเดียว ≠ cost ceiling รายเดือน ≠ query guard rail

> "Project delivery budget and go-live date (CONSTRAINTS.md) ≠ ongoing monthly cost ceiling
> (DATA_GOVERNANCE.md cost_governance) ≠ per-query cost guard rails (DATA_GOVERNANCE.md) —
> CONSTRAINTS.md owns what must be true before launch; DATA_GOVERNANCE.md owns what must stay true
> in operation."

| | Delivery budget | Monthly cost ceiling | Query guard rail |
|---|---|---|---|
| เจ้าของ | CONSTRAINTS.md | DATA_GOVERNANCE.md (Cost Governance) | DATA_GOVERNANCE.md (Cost Governance) |
| คืออะไร | เงินสร้างครั้งเดียว (เช่น ฿1,200,000 `[ILLUSTRATIVE]`) | budget รายเดือนต่อเนื่อง (เช่น ฿82,000/เดือน `[ILLUSTRATIVE]`) | per-query bytes limit ต่อ role |
| ใช้ตอนไหน | ก่อน launch | ตลอดการใช้งาน | ทุกครั้งที่ query รัน |

สามตัวเลขนี้เป็นเงินเหมือนกันแต่คนละความหมาย — เขียนปนกันในเอกสารเดียว (เช่น "งบประมาณ 1.2 ล้าน
บาทต่อเดือน") ทำให้ผู้อ่านไม่รู้ว่าเลขนี้ใช้กับ CONSTRAINTS.md หรือ DATA_GOVERNANCE.md
