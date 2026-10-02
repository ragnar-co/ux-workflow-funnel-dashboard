---
title: Data Engineering Layer — Pipeline (4 เอกสาร)
document_id: 03-PHASE-03-engineering-layer
version: 1.0.0
created_at: 2026-09-22
audience: all
owns: [phase-engineering-howto]
defers_to: [02-CORE-01-what-this-template-is.md, 04-SPEC-01-doc-map.md]
---

# Data Engineering Layer — Pipeline

ลำดับผลิต: `pipeline_spec` → `data_quality` → `sla_freshness` → `testing_strategy` (data_quality
ต้องรอ pipeline_spec, sla_freshness ต้องรอ pipeline_spec, testing_strategy ต้องรอทั้งสามตัวก่อนหน้า
รวม metric_logic)

## 【C|วิศวกร】 pipeline_spec — PIPELINE_SPEC.md (depends_on: [data_model_spec, metric_logic])

หกหัวข้อบังคับ: Pipeline Overview, Pipeline Definitions, Source Systems, Error Handling and Retry,
Credentials & Secret Management, Load Strategy — เอกสารนี้มี downstream มากที่สุดใน template (6
ฉบับ: data_quality, sla_freshness, testing_strategy, lineage, runbook, analytics_changelog)

**Source Systems มีสี่ประเภท** database, API, webhook, และ **product event stream** — ประเภทที่สี่
มักถูกลืม: ถ้ามี web-app ที่ใช้ template คู่กัน TRACKING_PLAN.md คือ producer ของ event stream
extraction method คือ streaming/webhook ingest **ไม่ใช่ CDC** (CDC อ่าน transaction log ของฐานข้อมูล
event stream ไม่มีฐานข้อมูลให้อ่านแบบนั้น) และ `event_name` ต้องตรงกับ enum ที่ TRACKING_PLAN.md เป็น
เจ้าของเท่านั้น — schema version ของ event มาจาก DATA_CONTRACT.md § Upstream Event Contract ไม่ใช่
จาก TRACKING_PLAN.md เอง (ไฟล์นั้นไม่มี versioning)

**Error Handling แยก Transient ≠ Permanent**: error ชั่วคราว (timeout, rate limit) retry แล้วมี
โอกาสสำเร็จ; error ถาวร (schema เปลี่ยน, credential หมดอายุ, ข้อมูลผิดรูป) retry กี่ครั้งก็ผลเดิม —
failure mode ที่เกิดซ้ำต้องมี scenario คู่กันใน RUNBOOK.md **Credentials & Secret Management ห้าม
hardcode เด็ดขาด** — ต้องมี secret store ต่อ connection, rotation policy พร้อม grace period, 1
pipeline = 1 service account (least privilege), auth failure alert แยกจาก retry (แจ้งทันที ไม่รอ
retry ครบ เพราะ auth error ไม่ใช่ transient) **Load Strategy** ต้องระบุต่อ pipeline: incremental vs
full refresh, watermark/cursor, upsert key (กันแถวซ้ำเมื่อรันซ้ำ), backfill window — pipeline ที่รัน
ซ้ำไม่ได้อย่างปลอดภัย (idempotent) ทำให้การกู้คืนทุกครั้งกลายเป็นการตัดสินใจเสี่ยง

## 【C|วิศวกร】 data_quality — DATA_QUALITY.md (depends_on: [data_model_spec, pipeline_spec])

ห้าหัวข้อบังคับ: Null and Completeness Checks, Range and Validity Checks, Referential Integrity
Checks, Anomaly Detection Rules, Quality Dashboards — **ทุก rule ต้องมีครบ 3 อย่าง**: severity
(`error` = block pipeline ทันที, `warning` = alert แต่รันต่อได้ — เอกสารนี้เป็นเจ้าของ
`rule_severity` enum), SQL assertion ที่รันได้จริง, และ action เมื่อ fail — rule ที่เขียนว่า "should
be positive" ไม่ใช่ rule ที่ execute ได้ **Anomaly threshold ต้องมาจากข้อมูลจริงย้อนหลัง** ไม่ใช่
ตัวเลขกลมๆ (แคบไปจะ alert fatigue, กว้างไปจะเงียบตอนที่ควรดัง) ค่าที่ยังไม่ calibrate = `null` พร้อม
เจ้าของ (NB1) referential integrity ต้องมี SQL assertion ทุกคู่ FK เพิ่ม upstream schema-drift
detection พร้อม action เมื่อจับได้ (หยุด pipeline, กันข้อมูลเข้า warehouse, แจ้งเจ้าของ contract)

## 【D|Data-Governance】 sla_freshness — SLA_FRESHNESS.md (depends_on: [pipeline_spec])

สี่หัวข้อบังคับ: Freshness Requirements per Dataset, Delay Tolerance Matrix, Alert Rules, Escalation
Procedures — เอกสารนี้เป็นเจ้าของ `dataset_criticality` enum (P0 business-critical / P1-P2
informational — **คนละแกนจาก `data_need_priority` ของ STAKEHOLDERS.md** แม้ใช้สัญลักษณ์เดียวกัน ดู
NB4 ใน `01-GOV-01`) **ห้ามกำหนด freshness SLA เร็วกว่า pipeline schedule** — SLA breach ทุกวันเพราะ
pipeline ไม่มีทางรันทัน คือ alert fatigue โดยไม่จำเป็น delay tolerance ต้องมากกว่า refresh frequency
เสมอ แยก warning threshold กับ critical threshold ชัดเจน escalation ระบุ role ไม่ใช่ชื่อบุคคล —
ขั้นตอนลงมือจริงหลัง escalate อยู่ที่ RUNBOOK.md แยกกันเพื่อให้แก้ playbook ได้โดยไม่แตะเกณฑ์ SLA

## 【C|วิศวกร】 testing_strategy — TESTING_STRATEGY.md (depends_on: [pipeline_spec, data_quality, metric_logic])

ห้าหัวข้อบังคับ: Unit Tests (dbt/SQL), Integration Tests, Metric Validation Tests, Dashboard
Acceptance Tests, Test Automation and CI — **unit test พิสูจน์ว่า SQL รันได้ตามที่เขียน; metric
validation test พิสูจน์ว่าตัวเลขตรงกับความจริง** — ผ่านชุดแรกครบแล้วยังรายงานผิดได้เสมอ ต้องมี golden
dataset (คำนวณมือไว้ล่วงหน้าว่า period ที่รู้ผลแน่นอนควรได้ค่าเท่าไร) ไม่ใช่แค่ null check
**row-level vs aggregate reconciliation** — aggregate ตรงไม่ได้แปลว่าแถวตรง เพราะผิดสองทางหักล้างกัน
ได้ Integration tests ต้องมี idempotency test (รันซ้ำ 2 ครั้งแล้วนับแถวไม่เพิ่ม) — CI/CD gates ต้อง
แยกชัดว่า test ไหน block deployment กับ test ไหน warn-only เท่านั้น
