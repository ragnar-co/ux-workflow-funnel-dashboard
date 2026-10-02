# รายงานหลักฐานการสอบ Practical — UX Workflow Funnel Dashboard

สถานะเอกสาร: **สร้างขึ้นหลังสิ้นสุดการสอบ (AFTER_EXAM)** โดย AI agent (Claude Code) ตามคำสั่งของผู้ใช้
ไฟล์นี้เป็นไฟล์ใหม่ที่สร้างขึ้นเพื่อการรวบรวมหลักฐานเท่านั้น ไม่ได้เป็นส่วนหนึ่งของ repo งานสอบ และไม่ได้ commit/push

**เวลาที่เริ่มรวบรวมหลักฐาน:** 2026-10-02 12:06:23 +07:00 (timezone ของเครื่องที่ใช้รัน, `+07`)
**ผู้รวบรวม:** AI agent (Claude Code) ภายใต้คำสั่งของผู้ใช้ในแชทนี้ หลังผู้ใช้แจ้งว่า "งานสอบ Practical สิ้นสุดแล้ว"

---

## ข้อจำกัดของหลักฐานในรายงานนี้ (อ่านก่อน)

1. รายงานนี้อ้างอิงเฉพาะ (ก) เนื้อหาบทสนทนาและผลลัพธ์ tool call ที่ปรากฏอยู่ใน context ของ session นี้ ณ เวลาที่เขียนรายงาน และ (ข) การตรวจไฟล์/Git แบบอ่านอย่างเดียวที่ทำเพิ่มเพื่อการรวบรวมหลักฐานเท่านั้น
2. ระบบ (harness) ของเครื่องมือนี้ระบุไว้เองว่าบทสนทนาที่ยาวเกินขีดจำกัดอาจถูก "สรุปย่อ (compaction)" โดยอัตโนมัติ ผู้เขียนรายงานไม่สามารถยืนยันได้ 100% ว่า session นี้ผ่านการสรุปย่อมาแล้วหรือไม่ และหากผ่านมาแล้ว รายละเอียดบางส่วนของคำสั่ง/ผลลัพธ์ในช่วงต้นอาจไม่ครบถ้วน 100% ตามที่เกิดขึ้นจริง
3. ทุกคำสั่ง (Bash/Read/Write/Edit) ที่ปรากฏใน session นี้ถูก**เรียกใช้โดย AI agent**ตามคำสั่งแชทของผู้ใช้ ไม่มีหลักฐานโดยตรงใน session นี้ว่าผู้สอบรันคำสั่งเองใน terminal แยกต่างหาก ยกเว้นการ commit ครั้งที่สอง (ดู E004) ซึ่งมีหลักฐานทางอ้อมว่าเกิดขึ้นนอกการควบคุมของ AI agent
4. ไม่พบหลักฐานการ deploy จริงบน Coolify ภายใน session นี้ (ไม่มี URL, deployment ID หรือ log การ deploy)
5. ไม่ทราบเวลาเริ่ม/สิ้นสุดสอบที่เป็นทางการ (ไม่มีข้อความระบุ deadline ที่ชัดเจนใน session) ดังนั้นการประเมิน "ทันเวลา" ทั้งหมดในรายงานนี้ระบุเป็น UNKNOWN

---

## A. ข้อมูลผู้สอบและขอบเขตหลักฐาน

| รายการ | ข้อมูล | สถานะ | Evidence ID |
|---|---|---|---|
| ชื่อผู้สอบ | Kanyanat Kumkailng | VERIFIED (จาก git commit author ทั้งสอง commit) | E003, E004 |
| อีเมลที่เกี่ยวข้อง | kanyanat.k@ragnar.co.th | VERIFIED (ตรงกันทั้งจาก system context ต้น session และ git commit author email) | E029 |
| บทบาทที่ระบุในเอกสารโครงการ | "UX/UI + analyst" | VERIFIED (ระบุใน PROJECT_STATUS.md / START_HERE.md ของ repo) | E012 |
| โจทย์ DDD ที่เลือก | `ddd-data-analytics` v2.8.0 (ห้ามใช้ `ddd-web-app`) | VERIFIED (ระบุชัดเจนใน CLAUDE.md และโครงสร้าง `ddd-data-analytics/reference/`) | E010, E011 |
| เครื่องมือที่ใช้ | Claude Code (AI coding agent), pytest, Docker, Playwright CLI (สำหรับ smoke test), git, SourceTree (อ้างถึงโดยผู้ใช้เอง แต่ไม่มีหลักฐานโดยตรงใน session ว่าใช้งานจริงนอกจากผลลัพธ์ที่สอดคล้องกัน) | VERIFIED (เครื่องมือในการพัฒนา) / REPORTED (SourceTree) | E020, E021, E022, E024, E004 |
| Repo / remote URL | `git@github.com:kanyanatkum/ux-workflow-funnel-dashboard.git` | VERIFIED (จาก `git remote -v` ของ local repo) — **ไม่ได้ยืนยันกับ GitHub จริงเพราะห้าม fetch/pull** | E006 |
| แอปที่ deploy (Coolify) | ไม่ทราบ | UNKNOWN — ไม่พบ URL, ไม่พบหลักฐานการ deploy ใด ๆ ใน session นี้ | — |
| ช่วงเวลาสอบ | ไม่ทราบเวลาเริ่ม/สิ้นสุดที่เป็นทางการ | UNKNOWN — มีเพียงข้อความ "งานสอบ Practical สิ้นสุดแล้ว" ที่ส่งเข้ามา ณ เวลารวบรวมหลักฐาน โดยไม่ระบุเวลาสิ้นสุดจริง | — |

**แหล่งข้อมูลที่เข้าถึงได้ใน session นี้:**
- บทสนทนาทั้งหมดที่ยังอยู่ใน context ของ AI agent ณ ขณะเขียนรายงาน (มีความเสี่ยงตามข้อจำกัดข้อ 2 ด้านบน)
- ผลลัพธ์ tool call (Bash/Read/Write/Edit) ที่บันทึกไว้ใน session นี้ รวมถึงผล pytest, ผล curl smoke test, ผล Playwright smoke test
- ไฟล์ทั้งหมดใน working tree ของ repo ณ เวลารวบรวมหลักฐาน
- ประวัติ git (`git log`, `git show`, `git diff`, `git status`) ของ local repo

**แหล่งข้อมูลที่ขาดหายหรือเข้าถึงไม่ได้:**
- หน้าจอ/การกระทำของผู้สอบนอกเหนือจากข้อความแชทและคำสั่งที่ AI agent เป็นผู้รันเอง
- สถานะจริงบน GitHub remote (ห้าม fetch/pull ตามขอบเขตงาน)
- หลักฐานการ deploy บน Coolify (ไม่เคยถูกกล่าวถึงผลลัพธ์จริงใน session นี้)
- เวลาสอบที่เป็นทางการจากผู้คุมสอบ/ระบบสอบ
- Log การใช้ token/quota ของ AI (ไม่มีตัวเลขปรากฏใน session)

---

## B. สภาพงานที่พบ (ณ เวลารวบรวมหลักฐาน)

- **Repo root:** `/Users/kanyanatkumkailng/Desktop/ux-workflow-funnel-dashboard` (E001)
- **Branch:** `main` (E001)
- **HEAD commit:** `52529d08da1bc5f30a81880703f7e59bd8a7937f` — message: `"1 commit"` — author: Kanyanat Kumkailng — timestamp: `2026-10-02T11:24:12+07:00` (E001, E004)
- **สถานะเทียบ remote:** `git status` รายงานว่า branch "up to date with 'origin/main'" และ `branch.ab +0 -0` — หมายความว่า local HEAD ตรงกับ remote-tracking ref ของ `origin/main` **ในเครื่องนี้** (ดูคำเตือนด้านล่าง) (E001)
- **Working tree ณ เวลารวบรวมหลักฐาน:** มีการแก้ไขที่ยังไม่ commit (`unstaged`) 2 ไฟล์:
  - `app/static/index.html` (+1 บรรทัด)
  - `app/static/styles.css` (+82/-28 บรรทัด โดยประมาณ)
  ไม่มี staged changes และไม่มี untracked files ที่ไม่ถูก ignore (E002, E005)

### แยกงานตามสถานะ commit

| กลุ่ม | รายละเอียด | สถานะหลักฐาน | Evidence ID |
|---|---|---|---|
| อยู่ใน commit แรก (`07f20f7`) | โครงสร้างแอปเริ่มต้นทั้งหมด: FastAPI backend (`app/main.py`, `app/db.py`, `app/metrics.py`, `app/validation.py`), frontend เริ่มต้น, เอกสาร DDD ทั้งชุด `docs/analytics/*`, `ddd-data-analytics/reference/*`, `ux-reference/*`, ทดสอบ (`tests/*`), `Dockerfile`, `requirements.txt`, `.gitignore` — รวม 169 ไฟล์ 41,682 บรรทัดเพิ่ม | VERIFIED (พบใน `git show --stat 07f20f7`) | E003 |
| อยู่ใน commit ที่สอง (`52529d0`) | ปรับปรุงเอกสาร (`README.md`, `PROJECT_STATUS.md`, `docs/analytics/DASHBOARD_SPEC.md`, `TASKS.md`, `TESTING_STRATEGY.md`, `VIZ_DESIGN_SPEC.md`), ปรับ UI dashboard รอบ redesign + modal popup (`app/static/app.js`, `index.html`, `styles.css`) — รวม 9 ไฟล์ 785 บรรทัดเพิ่ม/138 ลบ | VERIFIED (พบใน `git show --stat 52529d0`) | E004 |
| ยังไม่ commit (working tree) | การปรับ "premium polish" รอบล่าสุด: design token (radius/shadow/spacing), hover/transition, ข้อความ empty-state ใน `index.html`/`styles.css` | VERIFIED (พบใน `git diff` ปัจจุบัน) | E005 |
| ไฟล์ที่ไม่ทราบที่มา/ไม่สามารถยืนยันผู้เขียนได้ | ไม่พบ — ไฟล์ทั้งหมดใน working tree สามารถสืบย้อนไปยัง commit ใด commit หนึ่ง หรือ diff ที่ยังไม่ commit ได้ครบถ้วน | VERIFIED | E002, E003, E004, E005 |

**ข้อสังเกตสำคัญ:** commit ที่สอง (`52529d0`) มีข้อความ commit ว่า `"1 commit"` ซึ่งไม่ตรงรูปแบบข้อความที่ AI agent ใช้ในรายงานนี้ (AI agent สร้าง commit แรกด้วยข้อความ `"feat: build UX workflow funnel dashboard MVP"` ตามรูปแบบที่กำหนดไว้ และไม่มีการเรียก `git commit` ครั้งที่สองโดย AI agent ปรากฏใน session นี้เลย) จึง**อนุมาน (INFERRED)**ว่า commit ที่สองถูกสร้างขึ้นโดยผู้สอบเองนอกเหนือการควบคุมของ AI agent ในช่วงเวลาใดเวลาหนึ่งระหว่าง session (สอดคล้องกับที่ผู้สอบแจ้งไว้ในแชทว่าจะ "push ด้วย SourceTree") เหตุผลประกอบ: (1) ไม่มี tool call `git commit` ครั้งที่สองใน session, (2) เนื้อหาของ commit ตรงกับงานที่ AI agent เพิ่งแก้ไขเสร็จในรอบก่อนหน้าพอดี (9 ไฟล์ตรงกับ diff ที่เคยรายงานไว้ว่า "ยังไม่ commit" ในแชทรอบก่อน) — **สถานะ: INFERRED**

---

## C. ลำดับการทำงาน

> หมายเหตุ: ไม่มี timestamp ที่แม่นยำระดับวินาทีสำหรับทุกข้อความแชทใน session (ระบบไม่ได้แสดง timestamp ของแต่ละข้อความต่อผู้เขียนรายงาน) ลำดับด้านล่างเรียงตามลำดับก่อน-หลังที่ปรากฏใน session จริง และอ้างอิงเวลานาฬิกาเฉพาะจุดที่มีหลักฐานเป็นชื่อไฟล์/commit timestamp เท่านั้น ส่วนที่เหลือระบุว่า "ไม่ทราบเวลาแน่นอน"

| ลำดับ | เวลา/ช่วงเวลา | สิ่งที่ทำ | ผู้ดำเนินการที่ยืนยันได้ | ผลที่พบ | Evidence ID |
|---|---|---|---|---|---|
| 1 | ไม่ทราบเวลาแน่นอน (ก่อน 10:59 น.) | อ่านเอกสาร DDD ตามลำดับที่ CLAUDE.md กำหนด (START_HERE, PROJECT_STATUS, STAKEHOLDERS, CONSTRAINTS, KPI_DICTIONARY, BUSINESS_GLOSSARY, DATA_PROFILE, METRIC_SPEC, DATA_MODEL_SPEC, METRIC_LOGIC, PIPELINE_SPEC, DATA_QUALITY, TESTING_STRATEGY, VIZ_DESIGN_SPEC, DASHBOARD_SPEC, TASKS, ddd-data-analytics manual, ux-reference) | AI agent ตามคำสั่งผู้ใช้ "Read START_HERE.md and CLAUDE.md first..." | อ่านครบตามลำดับที่กำหนด ยืนยัน DDD track = `ddd-data-analytics` เท่านั้น | E011, E012, E013, E014 |
| 2 | ไม่ทราบเวลาแน่นอน | รัน `python3 scripts/validate_input.py data/raw/numnim_ux_funnel_mock.csv` ซ้ำเพื่อยืนยันผล validation | AI agent | ผ่าน (21,600 แถว, 200 องค์กร, 9 เดือน, 4 workflow, 0 error) | E008 |
| 3 | ไม่ทราบเวลาแน่นอน | ออกแบบและสร้างโครงสร้างแอป: DuckDB schema (`app/db.py`), metric SQL (`app/metrics.py`) อิงตาม `METRIC_LOGIC.md`, FastAPI endpoints (`app/main.py`), validation reuse (`app/validation.py`) | AI agent | สร้างไฟล์ครบ, โครงสร้างตรงกับ `DATA_MODEL_SPEC.md`/`METRIC_SPEC.md` | E015, E016, E017, E018 |
| 4 | ไม่ทราบเวลาแน่นอน | สร้าง frontend เริ่มต้น (vanilla JS/CSS, sidebar/topbar ตาม Ragnar design tokens) | AI agent | สร้าง `app/static/index.html`, `app.js`, `styles.css` | E003 |
| 5 | ไม่ทราบเวลาแน่นอน | เขียนและรัน automated tests (`tests/test_metrics.py`, `tests/test_integration.py`) | AI agent | ผลรัน: "7 passed" (ครั้งแรก) | E019, E020 |
| 6 | ไม่ทราบเวลาแน่นอน | สร้าง `Dockerfile`, `.dockerignore`, build + run container, smoke test local server และ container ผ่าน `curl` | AI agent | build สำเร็จ, container ตอบ HTTP 200 ที่ `/`, `/api/status`, `/api/workflows`, `/api/funnel` | E021, E022, E023 |
| 7 | ไม่ทราบเวลาแน่นอน | เพิ่ม searchable multi-select combobox สำหรับ filter องค์กร/เดือน (แทน `<select multiple>`) | AI agent | ทดสอบผ่าน Playwright: พิมพ์กรอง, เลือกหลายค่า, apply filter ส่งค่าผ่าน query param รูปแบบเดิม | E024 |
| 8 | 2026-10-02T10:59:09+07:00 | **`git init` + `git commit` ครั้งแรก** (ข้อความ "feat: build UX workflow funnel dashboard MVP") | AI agent (ยืนยันจาก tool call `git commit` ใน session) | commit `07f20f7` สำเร็จ, working tree clean หลัง commit | E003 |
| 9 | ไม่ทราบเวลาแน่นอน | Redesign dashboard: เพิ่ม KPI summary cards, กราฟแท่งเปรียบเทียบ completion rate, ส่วน funnel detail แบบ inline (ก่อนเปลี่ยนเป็น modal ภายหลัง) | AI agent | พบ bug จริงระหว่างทดสอบ (`/api/funnel` เรียก URL ผิดรูปแบบเมื่อไม่มี filter) และแก้ไขแล้วภายใน session เดียวกัน | E024 (ดูรายละเอียดใน หมวด F) |
| 10 | ไม่ทราบเวลาแน่นอน | ซิงค์เอกสาร (`README.md`, `PROJECT_STATUS.md`, `docs/analytics/DASHBOARD_SPEC.md`, `TASKS.md`, `TESTING_STRATEGY.md`, `VIZ_DESIGN_SPEC.md`) ให้ตรงกับ implementation จริง โดยไม่แก้ `METRIC_SPEC.md`/`METRIC_LOGIC.md`/`DATA_MODEL_SPEC.md`/`PIPELINE_SPEC.md` | AI agent ตามคำสั่ง "ห้าม commit" | แก้ไขเอกสารตามคำสั่ง ไม่ commit | E031 |
| 11 | ไม่ทราบเวลาแน่นอน | ปรับระยะห่าง (spacing) ของ 3 ส่วนบนหน้า dashboard | AI agent | ปรับ CSS เท่านั้น ไม่แตะ logic | — |
| 12 | ไม่ทราบเวลาแน่นอน | เปลี่ยนการแสดงผล "View funnel" จาก inline section เป็น modal popup | AI agent | ทดสอบผ่าน Playwright: เปิด/ปิด modal (×, ปุ่ม Close, Escape, คลิกพื้นหลัง) ทำงานถูกต้อง, พบและแก้ bug เรื่อง focus คืนไม่ถูกต้องหลังปิด modal | E024 |
| 13 | ไม่ทราบเวลาแน่นอน (ระหว่างลำดับ 8 ถึง 14) | **เกิด commit ที่สอง (`52529d0`) — ไม่มีหลักฐานการเรียก `git commit` โดย AI agent** | **ไม่ทราบ/INFERRED ว่าเป็นผู้สอบผ่าน SourceTree** | commit ครอบคลุมงานลำดับ 9–12 (9 ไฟล์) และปรากฏว่า branch ตรงกับ `origin/main` (เข้าข่ายมีการ push ไปแล้ว — ดูคำเตือนใน หมวด I) | E004, E006 |
| 14 | ไม่ทราบเวลาแน่นอน (หลังลำดับ 13) | ขอให้ตรวจสอบความพร้อม deploy (Dockerfile, .gitignore, .env, docker-compose, secrets) แบบอ่านอย่างเดียว | AI agent | รายงานผล: ไม่พบ secret, ไม่มี `.env`, มี `Dockerfile`/`.dockerignore`/`requirements.txt`, ไม่มี `docker-compose.yml` (ตามคำสั่งไม่ให้สร้าง) | — |
| 15 | 2026-10-02T11:08–12:05 (ช่วงจาก mtime/log) | "Premium polish" ปรับ visual design (shadow, radius, spacing scale, hover/transition) | AI agent | แก้ `index.html`, `styles.css` เท่านั้น — **ยังไม่ commit ณ เวลารวบรวมหลักฐาน** | E002, E005, E028 |
| 16 | 2026-10-02T12:06:23+07:00 | ผู้สอบแจ้งว่า "งานสอบ Practical สิ้นสุดแล้ว" และขอให้รวบรวมหลักฐาน | ผู้สอบ (ข้อความแชทโดยตรง) | เริ่มกระบวนการรวบรวมหลักฐานนี้ | — |

---

## D. คำสั่งและเครื่องมือที่ใช้ระหว่างสอบ

### D.1 คำสั่งที่มีหลักฐานว่า execute แล้ว (ระหว่าง session, ก่อนข้อความ "สอบสิ้นสุดแล้ว")

| ลำดับ | คำสั่ง/tool ที่พบ | จุดประสงค์ที่มีหลักฐาน | ผล/exit code ที่พบ | ช่วงเวลา | Evidence ID |
|---|---|---|---|---|---|
| 1 | `python3 scripts/validate_input.py data/raw/numnim_ux_funnel_mock.csv` (รันซ้ำหลายครั้ง) | ยืนยันผล validation ของ CSV ต้นฉบับ | passed, exit 0 ทุกครั้งที่รัน | TIME_UNKNOWN (ภายใน DURING session ก่อนข้อความสิ้นสุดสอบ) | E008 |
| 2 | `pip3 install --user fastapi uvicorn python-multipart pytest httpx` | ติดตั้ง dependency สำหรับ backend/test | ติดตั้งสำเร็จ | TIME_UNKNOWN | E020 (บริบท) |
| 3 | `python3 -m pytest tests/ -q` (รันซ้ำ ≥ 6 ครั้งตลอด session หลังแก้โค้ดแต่ละรอบ) | ตรวจสอบว่าการแก้ไข UI/เอกสารแต่ละรอบไม่ทำให้ test เดิมพัง | **"7 passed" ทุกครั้งที่รัน ไม่เคยพบ failure ใน session นี้** (สรุปรวมจากหลายครั้ง ไม่ใช่ครั้งเดียว) | TIME_UNKNOWN (กระจายตลอด session) | E020 |
| 4 | `docker build -t ux-workflow-funnel-dashboard:smoke .` | สร้าง image ตาม Dockerfile เพื่อทดสอบความพร้อม deploy | build สำเร็จ | TIME_UNKNOWN | E021, E022 |
| 5 | `docker run -d ... -p 8001:8000 ...` + `curl` ตรวจ endpoint | smoke test container ให้เหมือนที่ Coolify จะรัน | HTTP 200 ที่ `/`, `/api/status`, `/api/workflows`, `/api/funnel` | TIME_UNKNOWN | E022 |
| 6 | `python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000` (รันซ้ำหลายครั้งหลัง restart) | รันเซิร์ฟเวอร์ local เพื่อทดสอบ | server ขึ้น, ตอบ HTTP 200 | TIME_UNKNOWN | E023 |
| 7 | `git init`, `git add .`, `git commit -m "feat: build UX workflow funnel dashboard MVP"` | เริ่มต้น git และสร้าง commit แรก | commit `07f20f7` สำเร็จ, `git status` หลัง commit แสดง "working tree clean" | 2026-10-02T10:59:09+07:00 | E003 |
| 8 | `playwright-cli open/click/type/snapshot/console/screenshot/close` (ชุดคำสั่งจำนวนมาก สรุปรวม) | smoke test การโต้ตอบจริงของ UI (filter, modal, spacing, visual) ในเบราว์เซอร์จริง | ไม่พบ JS console error ใหม่ (พบเฉพาะ favicon 404 ที่ไม่เกี่ยวข้อง) ในรอบท้าย ๆ, พบและแก้ bug จริง 1 รายการ (ดู หมวด F) | 2026-10-02 03:55–05:05 UTC (= 10:55–12:05 +07) ตามชื่อไฟล์ log ใน `.playwright-cli/` | E024, E025 |
| 9 | `rm -f data/app/ux_workflow_funnel.duckdb*` (รีเซ็ต DB ก่อนทดสอบใหม่หลายครั้ง) | ทดสอบ fixture auto-load ตั้งแต่ต้นใหม่ | โหลด fixture ใหม่สำเร็จทุกครั้ง | TIME_UNKNOWN | E023 |

*หมายเหตุ: รายการนี้เป็น**การสรุปคำสั่งที่ทำซ้ำหลายครั้ง**ตลอด session (เช่น pytest และ playwright-cli ถูกเรียกมากกว่า 10 ครั้งรวมกัน) ไม่ใช่ลำดับคำสั่งแบบ line-by-line ทั้งหมด*

### D.2 คำสั่งที่เพียงเสนอหรือกล่าวถึง (ไม่มีหลักฐานว่าถูก execute จริงใน session)

| คำสั่ง | บริบทที่ถูกเสนอ | สถานะ |
|---|---|---|
| `git remote add origin <COMPANY_REPO_URL>` / `git push -u origin main` | AI agent เสนอเป็นคำแนะนำให้ผู้สอบรันเองหลัง commit แรก | REPORTED — ไม่มีหลักฐาน execute โดย AI agent; แต่สถานะ repo ปัจจุบัน (E001, E006) สอดคล้องกับว่ามีการเพิ่ม remote และ push เกิดขึ้นจริงในภายหลังโดยผู้สอบ |
| `docker run -p 8000:8000 -v "$(pwd)/data/app:/srv/app/data/app" ...` (คำสั่งใน README สำหรับใช้งานจริง) | เขียนไว้ใน README.md เป็นคำแนะนำการใช้งาน | REPORTED — เป็นคำสั่งตัวอย่างใน README ไม่ใช่ log การรันจริงด้วยพารามิเตอร์ชุดนี้เป๊ะ ๆ (คำสั่งที่รันจริงใน session ใช้ `-p 8001:8000` และไม่ mount volume ดูรายการ D.1 ข้อ 5) |

### D.3 คำสั่งอ่านอย่างเดียวที่ใช้รวบรวมรายงานหลังสอบ (AFTER_EXAM)

`pwd`, `date`, `git rev-parse --show-toplevel`, `git branch --show-current`, `git rev-parse HEAD`, `git log` (หลายรูปแบบ), `git status` (หลายรูปแบบ), `git remote -v`, `git show --stat`, `git diff` (หลายรูปแบบ), `ls`, `find`, `cat`, `stat` — ทั้งหมดเป็นคำสั่งอ่านอย่างเดียว ไม่มีคำสั่งใดแก้ไขไฟล์หรือ Git state (ยกเว้นการสร้างไฟล์รายงานนี้ไฟล์เดียว)

---

## E. การตัดสินใจและการใช้ AI

| การตัดสินใจ | เหตุผลที่ปรากฏในหลักฐาน | Evidence ID |
|---|---|---|
| เลือก DDD track = `ddd-data-analytics` (ไม่ใช่ `ddd-web-app`) | ระบุไว้ตรง ๆ ใน `CLAUDE.md`: "Do not model the project around web-app bounded contexts..." และ "Build `UX Workflow Funnel Dashboard` using `ddd-data-analytics` as the single DDD track" | E011 |
| เลือก backend = FastAPI (Python) + DuckDB | ระบุเหตุผลใน `PROJECT_STATUS.md`/README ว่าเลือกเพราะ "120-minute delivery window and Coolify compatibility" และ DuckDB ถูกกำหนดไว้แล้วใน `CONSTRAINTS.md` ตั้งแต่ต้น (ไม่ใช่ทางเลือกใหม่) | E012, E014 |
| เลือก frontend = vanilla JS/CSS ไม่ใช้ framework ที่ต้อง build step | ระบุเหตุผลว่า "lightest option compatible with Coolify" และสอดคล้องกับ `CONSTRAINTS.md` ที่ระบุว่า framework "choose the lightest option" | E012 |
| ไม่ทำ AI Investigation Brief (bonus) | ระบุชัดใน `docs/analytics/TASKS.md` ว่า "Do not start the AI bonus while any core assignment acceptance item is failing" และสถานะล่าสุดระบุ "not started (bonus, deferred)" | E027 |
| ไม่แก้ `METRIC_SPEC.md`/`METRIC_LOGIC.md`/`DATA_MODEL_SPEC.md`/`PIPELINE_SPEC.md` ระหว่างงาน UI/เอกสารรอบหลัง | เป็นคำสั่งขอบเขตที่ผู้สอบระบุไว้ชัดเจนในหลายข้อความแชทติดต่อกัน ("Do not change metric formulas", "unless the implementation actually changed those contracts") และ `git diff`/`git show` ยืนยันว่าไฟล์เหล่านี้ไม่มีการแก้ไขหลัง commit แรก | E003, E004 (ไม่มีไฟล์เหล่านี้ปรากฏใน diff ของ commit ที่สอง) |

**หลักฐานการตรวจ/ปรับ output ของ AI โดยผู้สอบ:**
พบรูปแบบคำสั่งแชทที่**กำหนดขอบเขตเฉพาะเจาะจงขึ้นเรื่อย ๆ ในแต่ละรอบ** (เช่น "Adjust only the filter UX", "Polish ... only", "Do not redesign the page structure") ซึ่งแต่ละรอบอ้างอิงถึงผลลัพธ์ของรอบก่อนหน้าโดยตรง (เช่น ขอเปลี่ยนจาก inline section เป็น modal หลังเคยเห็นผลแบบ inline) ลักษณะนี้**บ่งชี้ (INFERRED)**ว่าผู้สอบได้ตรวจสอบผลลัพธ์ระหว่างรอบและสั่งปรับทิศทางต่อเนื่อง อย่างไรก็ตาม **ไม่มีหลักฐานโดยตรงใน session นี้ว่าผู้สอบอ่าน/เข้าใจโค้ดในระดับบรรทัด** (เช่น ไม่มีข้อความชี้เฉพาะเจาะจงว่า "บรรทัดนี้ผิด") — การแก้ bug (URL formatting, focus management) ทั้งสองครั้งที่พบใน session นี้ถูกค้นพบและแก้ไขโดย AI agent เองระหว่างการทดสอบ Playwright ของตัวเอง ไม่ใช่จากคำทักท้วงของผู้สอบ

**Token/quota:** ไม่พบตัวเลขการใช้ token หรือ quota คงเหลือปรากฏที่ใดใน session นี้ — **UNKNOWN**, ไม่มีการประมาณค่าในรายงานนี้

---

## F. ปัญหาและสิ่งที่ติด

| ปัญหา | อาการ/error ที่พบ | วิธีที่ลอง | ผลที่ยืนยันได้ | ยังไม่ทราบ/ยังค้าง | Evidence ID |
|---|---|---|---|---|---|
| URL ของ `/api/funnel` สร้างผิดรูปแบบเมื่อไม่มี filter | Console error: `TypeError: Cannot read properties of undefined (reading 'length')` ที่ `renderFunnel` และ network request เป็น `GET /api/funnel&workflow_name=...` (ขาด `?`) เมื่อไม่มี organization/month filter ถูกเลือก | แก้ `loadFunnel()` ใน `app.js` ให้ใช้ฟังก์ชัน `qs()` เดียวกันกับ endpoint อื่นแทนการต่อ string เอง | ทดสอบซ้ำด้วย Playwright: คลิก "View funnel" โดยไม่มี filter แล้ว request กลายเป็น `GET /api/funnel?workflow_name=...` และ console error หายไป (เหลือ 0 error) | พบและแก้ภายใน session เดียวกัน ไม่มีรายการค้าง | E024 |
| Focus ไม่คืนกลับไปที่ปุ่ม "View funnel" หลังปิด modal | เก็บ reference DOM element เดิมไว้ (`lastFocusedBeforeModal`) แต่แถวตารางถูกสร้างใหม่ทุกครั้งที่ข้อมูลรีเฟรช ทำให้ reference เป็น node ที่หลุดจาก DOM แล้ว, `.focus()` จึงไม่มีผล (focus ตกไปที่ `<body>`) | เปลี่ยนวิธีค้นหาปุ่มเป้าหมายจาก DOM reference เดิม เป็นการค้นหาใหม่ด้วย `data-workflow-name` attribute ทุกครั้งที่ปิด modal | ทดสอบซ้ำด้วย Playwright: `document.activeElement` หลังกด Escape คือปุ่ม "View funnel" ที่ถูกต้อง | พบและแก้ภายใน session เดียวกัน ไม่มีรายการค้าง | E024 |
| ไม่มีหลักฐานการ deploy บน Coolify | ไม่มี error หรือ log ปรากฏ เพราะไม่เคยมีความพยายาม deploy จริงใน session นี้เลย | ไม่มี — เป็นขอบเขตที่ถูกส่งต่อให้ผู้สอบทำเอง | ไม่มีผลให้ยืนยัน | **ค้างอยู่ — ไม่ทราบสถานะ** | — |
| commit ที่สองไม่มีหลักฐานการสร้างใน session | ข้อความ commit "1 commit" ปรากฏขึ้นโดยไม่มี tool call `git commit` รองรับ | ตรวจสอบ diff ของ commit เทียบกับงานที่ AI agent เคยรายงานว่า "ยังไม่ commit" ในรอบก่อนหน้า | เนื้อหาตรงกันพอดี (9 ไฟล์) จึงอนุมานว่าเป็นการ commit จากภายนอก session (ผู้สอบผ่าน SourceTree) | **ยังไม่ทราบเวลาที่แท้จริงที่ commit นี้เกิดขึ้นเทียบกับเวลาสอบ** | E004 |

---

## G. งานที่ส่งมอบ

### G.1 ฟังก์ชันหลักที่พบ implementation (VERIFIED = พบโค้ด, ไม่ใช่ยืนยันว่าทำงานสำเร็จเสมอ)

| ฟังก์ชัน | พบ implementation ที่ | หลักฐานการใช้งานสำเร็จ (ถ้ามี) | Evidence ID |
|---|---|---|---|
| อัปโหลดและ validate CSV ก่อนบันทึก | `app/main.py` (`POST /api/upload`), ใช้กฎจาก `scripts/validate_input.py` ผ่าน `app/validation.py` | ทดสอบอัตโนมัติ `tests/test_integration.py::test_invalid_csv_is_rejected_and_active_dataset_is_preserved` ผ่าน (ผลรันจริงใน session, ดู E020) | E017, E018, E020 |
| บันทึกลง DuckDB แบบ atomic replace | `app/db.py` (`replace_active_dataset`, staging table + transaction) | ทดสอบอัตโนมัติ `tests/test_integration.py::test_full_pipeline_load_persist_and_query` ผ่าน | E015, E020 |
| คำนวณ workflow completion rate / step drop-off count-rate / highest drop-off step | `app/metrics.py` อิงสูตรจาก `docs/analytics/METRIC_LOGIC.md` ตรง ๆ | ทดสอบอัตโนมัติ `tests/test_metrics.py` (4 เทสต์ครอบคลุมสูตรและ edge case) ผ่าน + ยืนยันตัวเลขตรงกับ API response จริงใน smoke test (เช่น sum-then-ratio ของ Overall Completion Rate = 982,027/1,579,151 = 62.2%) | E016, E020, E023 |
| Workflow Overview: KPI cards, กราฟแท่งเทียบ completion rate, ตาราง, filter องค์กร/เดือนแบบ searchable | `app/static/index.html`, `app.js`, `styles.css` | ยืนยันผ่าน Playwright smoke test (ภาพหน้าจอ + snapshot ใน session) ว่าแสดงผลถูกต้องตรงกับ API | E024 |
| Selected Workflow Funnel Detail ผ่าน modal popup | `app/static/index.html` (`#funnel-modal`), `app.js` (`openModal/closeModal/loadFunnel`) | ยืนยันผ่าน Playwright: เปิด modal, ข้อมูล step/dropoff ตรงกับ API, ไฮไลต์ highest-dropoff ถูกต้อง, ปิดได้ 3 ทาง (×, Close, Escape, คลิกพื้นหลัง) | E024 |
| อย่างน้อย 1 automated test ผ่าน | `tests/test_metrics.py` (5 เทสต์), `tests/test_integration.py` (2 เทสต์) รวม 7 เทสต์ | รันจริงซ้ำหลายครั้งใน session ผลเป็น "7 passed" ทุกครั้ง | E019, E020 |
| Container พร้อม deploy (Dockerfile) | `Dockerfile`, `.dockerignore` | build + run สำเร็จ, ตอบ HTTP 200 ที่ทุก endpoint หลักเมื่อทดสอบใน container | E021, E022 |

### G.2 ข้อจำกัดที่พบ (ไม่ได้ทดลองใหม่)

- **persistence หลัง restart ผ่าน volume ของ Coolify จริง:** ไม่เคยทดสอบ มีเพียงการทดสอบ `docker run` แบบ local ที่ไม่ได้ mount volume ในการ smoke test จริง (คำสั่ง mount volume ปรากฏเฉพาะใน README เป็นคำแนะนำ — ดู D.2) — **UNKNOWN ว่าทำงานถูกต้องบน Coolify จริงหรือไม่**
- **การ push ไป GitHub จริง:** local repo แสดงว่า branch ตรงกับ `origin/main` (ไม่มี ahead/behind) ซึ่งเป็นหลักฐานทางอ้อมว่ามีการ push เกิดขึ้น แต่**ไม่สามารถยืนยันกับฝั่ง remote ได้จริงในรายงานนี้**เพราะข้อจำกัดห้าม fetch/pull
- **ความถูกต้องของ working tree ปัจจุบัน (premium polish) ว่าถูกส่งมอบแล้วหรือไม่:** การเปลี่ยนแปลงล่าสุด (`index.html`, `styles.css`) ยังไม่ถูก commit ณ เวลารวบรวมหลักฐาน จึง**ไม่อยู่ใน commit ที่ตรงกับ `origin/main`** — หากเกณฑ์การตรวจอิงจากสถานะที่ push แล้ว งานส่วนนี้จะไม่ถูกนับรวม

---

## H. หลักฐาน Test / Validation

| กรณีทดสอบ | คำสั่ง/ขั้นตอน | Expected | Actual (ผลรันจริงใน session) | ช่วงเวลา/commit ที่สัมพันธ์ | Evidence ID |
|---|---|---|---|---|---|
| CSV ต้นฉบับผ่าน validation | `python3 scripts/validate_input.py data/raw/numnim_ux_funnel_mock.csv` | `status: passed`, 0 errors | `status: passed`, 21,600 แถว, 0 errors (ตรงกับ `data/processed/source_validation_report.json`) | ก่อน commit แรก (10:59) | E008 |
| step drop-off count/rate ตรงสูตร | `pytest tests/test_metrics.py` | ค่าตรงตามสูตรใน `METRIC_LOGIC.md` (sum ก่อนหารรวม edge case started=0 → rate เป็น null) | ผ่านทั้งหมด (ส่วนหนึ่งของ "7 passed") | ตลอด session หลังสร้างไฟล์ทดสอบ | E019, E020 |
| full pipeline (load→persist→query) | `pytest tests/test_integration.py::test_full_pipeline_load_persist_and_query` | โหลด fixture, query ได้ค่าที่คาดไว้ | ผ่าน | เช่นเดียวกับข้างต้น | E019, E020 |
| ปฏิเสธ CSV ที่ไม่ผ่าน validation โดยไม่ทับ active dataset | `pytest tests/test_integration.py::test_invalid_csv_is_rejected_and_active_dataset_is_preserved` | active dataset ไม่เปลี่ยนแปลงหลังอัปโหลด CSV ที่ผิด | ผ่าน | เช่นเดียวกับข้างต้น | E019, E020 |
| Smoke test ปลายทาง (end-to-end) ผ่าน UI จริง | Playwright: เปิดหน้าเว็บ, กรอง filter, เปิด/ปิด modal, ตรวจค่าตัวเลขเทียบ API | แสดงผลตรงกับ backend, ไม่มี JS error | ตรงกันทุกจุดที่ตรวจ, console error เหลือเฉพาะ favicon 404 ที่ไม่เกี่ยวข้อง | ตลอด session (03:55–05:05 UTC ตาม log) | E024, E025 |
| Docker container smoke test | `docker build` + `docker run` + `curl` | container ตอบเหมือน local server | HTTP 200 ทุก endpoint ที่ทดสอบ | TIME_UNKNOWN | E021, E022 |

**ข้อสรุปสำคัญ:** ผลทดสอบทั้งหมดข้างต้นเป็น**ผลรันจริงที่ปรากฏใน session นี้** (ไม่ใช่แค่โค้ดทดสอบที่มีอยู่เฉย ๆ) แต่ทั้งหมดถูกรันโดย AI agent เองในระหว่างการพัฒนา — **ไม่มีหลักฐานว่าผู้สอบรันคำสั่งทดสอบเหล่านี้ด้วยตนเองซ้ำอีกครั้งนอก session** รายงานนี้**ไม่ได้รันคำสั่งทดสอบซ้ำเพิ่มเติม**ตามข้อกำหนดขอบเขต (ห้ามรัน test ใหม่)

---

## I. หลักฐาน Repo และ Coolify

| รายการ | ข้อมูลที่พบ | สถานะ | Evidence ID |
|---|---|---|---|
| Repo URL | `git@github.com:kanyanatkum/ux-workflow-funnel-dashboard.git` | VERIFIED (จาก local git config เท่านั้น) | E006 |
| HEAD commit SHA ปัจจุบัน | `52529d08da1bc5f30a81880703f7e59bd8a7937f` | VERIFIED | E001 |
| หลักฐานการ push | `git status` รายงาน local `main` ตรงกับ remote-tracking ref `origin/main` พอดี (ไม่ ahead ไม่ behind) | **INFERRED (ไม่ใช่ VERIFIED โดยตรง)** — remote-tracking ref ในเครื่อง local ไม่สามารถพิสูจน์ได้ 100% ว่าฝั่ง GitHub server ได้รับจริง เพราะรายงานนี้ห้าม fetch/pull เพื่อยืนยันกับ server | E001, E006 |
| commit ที่ (น่าจะ) ถูก push | สอดคล้องกับ `52529d0` เพราะเป็น commit เดียวกับที่ remote-tracking ref ชี้ไป | INFERRED | E001, E004 |
| commit ที่ส่งสอบจริง (ตามเวลาสอบ) | **ไม่ทราบ** — ไม่มีการระบุ deadline ของสอบ จึงไม่สามารถชี้ชัดว่า commit ใดคือ "commit ที่ส่งสอบ" ได้ อาจเป็น `52529d0` (ถ้าปิดงานก่อนทำ premium polish) หรืออาจต้องรวม working tree ปัจจุบันที่ยังไม่ commit ด้วย (ถ้ายังไม่ปิดงาน) | **UNKNOWN** | E001, E002 |
| Deployment ID / URL บน Coolify | ไม่พบในที่ใดของ session | **UNKNOWN — ไม่พบหลักฐาน** | — |
| commit ที่ deploy | ไม่พบ | **UNKNOWN** | — |
| ผลเปิดใช้งานจริงบน Coolify | ไม่พบ | **UNKNOWN** | — |

**คำเตือนสำคัญตามกติกาสอบ:** local commit หรือสถานะ remote-tracking branch เพียงอย่างเดียว **ไม่ยืนยันว่า push ทันเวลา** (ไม่ทราบเวลาสอบ จึงประเมิน "ทันเวลา" ไม่ได้เลย) และ**ไม่มี URL แอปที่ deploy แล้ว**ให้ตรวจสอบว่าใช้ commit ใด

---

## J. หลักฐาน AI workflow โบนัส

**ไม่พบหลักฐาน** การมี AI workflow แบบ runtime (เช่น endpoint ที่เรียก AI model จากข้อมูลใน DB แล้วบันทึก/แสดงผล) ในโค้ดของ repo ณ เวลารวบรวมหลักฐาน

หลักฐานที่ตรวจพบ:
- `docs/analytics/DASHBOARD_SPEC.md`, `TASKS.md`, `BUSINESS_GLOSSARY.md` กล่าวถึง "UX Investigation Brief" ในฐานะ**แผนที่ยังไม่ทำ** (bonus, deferred) เท่านั้น (E027)
- ไม่มีไฟล์ชื่อ `AI_MODEL_SPEC.md` หรือโค้ดที่เรียก AI endpoint ใด ๆ ใน `app/` (ตรวจด้วย grep หา "openai/anthropic/ai_model/investigation brief" ไม่พบ code path ที่ทำงานจริง มีเพียงข้อความอ้างอิงในเอกสาร) (E027)
- การใช้ "Claude Code" ที่ปรากฏทั้งหมดใน session นี้คือการใช้**ช่วยเขียนโค้ด** (coding agent) ไม่ใช่ AI feature ที่เป็นส่วนหนึ่งของ runtime ของแอป — ทั้งสองส่วนนี้แยกจากกันชัดเจนในหลักฐาน

สรุป: หมวดนี้ไม่มีผลต่อการให้คะแนนในทางลบหรือบวกตามกติกาที่กำหนด — ระบุเพียงว่า "ไม่พบหลักฐาน"

---

## K. ตารางหลักฐานตามเกณฑ์สอบ

| หัวข้อ | หลักฐานที่รองรับ | Evidence ID | สถานะหลักฐาน | สิ่งที่ยังยืนยันไม่ได้ |
|---|---|---|---|---|
| ประโยชน์และฟังก์ชันหลัก | Workflow completion rate, step drop-off count/rate, highest-drop-off step, upload+validate, filter แบบ searchable — พบ implementation และผลทดสอบอัตโนมัติ+สมอกเทสต์ตรงกัน | E015–E024 | VERIFIED (พบ implementation + ทดสอบผ่านใน session) | การใช้งานจริงโดยผู้ใช้ปลายทางนอก session |
| การใช้ DDD | `CLAUDE.md` ระบุ `ddd-data-analytics` เป็น track เดียว, มีเอกสารครบ 15 จาก 23 ไฟล์ตาม generation order (P0/P1 หลักครบ, ขาดบางไฟล์ P1/P2 เช่น `DATA_CONTRACT.md`, `SLA_FRESHNESS.md`, `REPORT_SPEC.md`, `DATA_GOVERNANCE.md`, `AGENTS.md`, `LINEAGE.md`, `AI_MODEL_SPEC.md`, `RUNBOOK.md`, `ANALYTICS_CHANGELOG.md`) | E009, E010, E011 | VERIFIED (บางส่วน) | ไม่ทราบว่าการขาดเอกสารบางฉบับเป็นไปตามขอบเขตที่ตั้งใจ (MVP 120 นาที) หรือเป็นความไม่ครบถ้วน — ไม่มีคำอธิบายชัดเจนในหลักฐานว่าทำไมหยุดที่ 15 ไฟล์ |
| ฐานข้อมูลและ persistence | DuckDB จริง (`duckdb` python package), atomic replace transaction, ไฟล์ persist ที่ `data/app/ux_workflow_funnel.duckdb` (gitignored ตามควร) | E015, E020 | VERIFIED (พบ implementation + ทดสอบผ่าน) | persistence ข้าม container restart บน Coolify จริง (ไม่เคยทดสอบ) |
| Test / Validation | 7 automated tests (`pytest`), รันผ่านซ้ำหลายครั้งตลอด session | E019, E020 | VERIFIED (ผลรันจริงใน session, ไม่ใช่แค่โค้ด) | ผลรันซ้ำโดยอิสระนอก session ของ AI agent |
| Push repo และ Coolify deployment | local HEAD ตรงกับ `origin/main`; ไม่พบหลักฐาน Coolify ใด ๆ | E001, E004, E006 | Push: **INFERRED** / Coolify: **UNKNOWN** | เวลาที่ push จริง, การยืนยันฝั่ง GitHub server, ทุกอย่างเกี่ยวกับ Coolify |
| การใช้งานและส่งมอบ | README.md ปรับปรุงให้มีคำสั่งรันจริง (`uvicorn`, `pytest`, `docker build/run`) ตรงกับที่ทดสอบจริงใน session | E031, E023 | VERIFIED (เอกสารตรงกับสิ่งที่ทดสอบจริง) | — |
| AI workflow โบนัส | ไม่พบหลักฐาน implementation ใด ๆ | E027 | **UNKNOWN / ไม่พบหลักฐาน** (ไม่ใช่ "ไม่ผ่าน") | ทั้งหมด — ยังไม่เริ่มทำตามแผนที่ระบุไว้เอง |

### เงื่อนไขบังคับ

| เงื่อนไข | ผล | Evidence ID |
|---|---|---|
| ฟังก์ชันหลักใช้ได้ | VERIFIED — ทดสอบผ่านทั้ง automated test และ Playwright smoke test ใน session | E019, E020, E024 |
| ใช้ DB จริง (DuckDB) | VERIFIED — พบ implementation จริง, ไม่ใช่ mock/stub, ทดสอบผ่าน | E015, E020 |
| มี Test/Validation ที่ผ่าน | VERIFIED — "7 passed" ซ้ำหลายครั้งตลอด session | E019, E020 |
| Push ทันเวลา | **UNKNOWN** — ไม่ทราบเวลาสอบ, มีเพียงหลักฐานทางอ้อมว่ามีการ push เกิดขึ้น (ไม่ทราบเวลา) | E001, E006 |
| Deploy เปิดใช้ทันเวลา | **UNKNOWN** — ไม่พบหลักฐานการ deploy ใด ๆ | — |

---

## L. Evidence Index

| ID | ประเภท/ตำแหน่ง | Excerpt (ปกปิดแล้ว) | ช่วงเวลา | ข้อเท็จจริงที่รองรับ |
|---|---|---|---|---|
| E001 | คำสั่ง git แบบอ่านอย่างเดียว ใน session รวบรวมหลักฐาน (`git rev-parse`, `git branch`, `git status`) | `branch.head main` / `branch.upstream origin/main` / `branch.ab +0 -0` / HEAD=`52529d0...` | AFTER_EXAM (2026-10-02 12:06 +07) | repo root, branch, HEAD SHA, สถานะเทียบ remote-tracking ref |
| E002 | `git status` / `git diff --stat` (อ่านอย่างเดียว) | `modified: app/static/index.html` / `modified: app/static/styles.css` | AFTER_EXAM | มี uncommitted changes 2 ไฟล์ ไม่มี staged/untracked อื่น |
| E003 | `git show --stat 07f20f7` | `Message: feat: build UX workflow funnel dashboard MVP` / `169 files changed, 41682 insertions(+)` | DURING_EXAM (2026-10-02T10:59:09+07:00) | commit แรก, ขอบเขตไฟล์ทั้งหมดที่รวมอยู่ |
| E004 | `git show --stat 52529d0` | `Message: 1 commit` / 9 files, `785 insertions(+), 138 deletions(-)` | ไม่ทราบเวลาแน่ชัด (commit timestamp 2026-10-02T11:24:12+07:00) | commit ที่สอง, ไม่มี tool call รองรับจาก AI agent |
| E005 | `git diff` (uncommitted, อ่านอย่างเดียว) | `-  --radius-card: 14px;` / `+  --radius-card: 18px;` ฯลฯ, เพิ่ม `<p class="section-hint">Select a workflow...</p>` | AFTER_EXAM-adjacent (เนื้อหาเขียนระหว่าง DURING_EXAM แต่ตรวจยืนยันตอน AFTER_EXAM) | ยืนยันว่า uncommitted diff คือรอบ "premium polish" เท่านั้น ไม่ปนกับ modal/redesign ที่ commit ไปแล้ว |
| E006 | `git remote -v` | `origin git@github.com:kanyanatkum/ux-workflow-funnel-dashboard.git (fetch/push)` | AFTER_EXAM | repo URL ที่ configure ไว้ใน local git |
| E008 | ผลรัน `scripts/validate_input.py` ใน session + `data/processed/source_validation_report.json` | `"status": "passed", "row_count": 21600, "errors": []` | DURING_EXAM (TIME_UNKNOWN แน่นอน) | CSV ต้นฉบับผ่าน validation ตามกฎ |
| E009 | `ls docs/analytics/` | รายชื่อ 15 ไฟล์ | AFTER_EXAM | จำนวนเอกสาร DDD ที่มีอยู่จริงใน repo |
| E010 | `find ddd-data-analytics -maxdepth 3 -type f` | รายชื่อ 17 ไฟล์ manual/reference | AFTER_EXAM | มีชุดอ้างอิง DDD track `ddd-data-analytics` v2.8.0 ครบตามแพ็ก |
| E011 | เนื้อหา `CLAUDE.md` ที่อ่านตอนต้น session | "Build `UX Workflow Funnel Dashboard` using `ddd-data-analytics` as the single DDD track. Do not model the project around web-app bounded contexts..." | DURING_EXAM | ยืนยันการเลือก/บังคับ DDD track |
| E012 | เนื้อหา `PROJECT_STATUS.md`/`START_HERE.md` ที่อ่านตอนต้น session | "21,600 rows... Workflows: Consent Setup, Data Breach Report, Data Subject Request, RoPA" / "User role: UX/UI + analyst" | DURING_EXAM | ข้อเท็จจริงของข้อมูลต้นฉบับและบทบาทผู้ใช้ |
| E013 | เนื้อหา `docs/analytics/METRIC_SPEC.md`/`METRIC_LOGIC.md` | สูตร `step_dropoff_rate = step_dropoff_count / step_started`, กฎ "sum counts first, then calculate ratios" | DURING_EXAM | ที่มาของสูตรที่ implementation ต้องอิงตาม |
| E014 | เนื้อหา `docs/analytics/DATA_MODEL_SPEC.md` | ตาราง `fct_workflow_funnel_step`, natural key `organization_id+period_month+workflow_name+step_order` | DURING_EXAM | schema ที่ implementation ต้องอิงตาม |
| E015 | เนื้อหา `app/db.py` (เขียนโดย AI agent ใน session, ตรงกับ HEAD ปัจจุบันเพราะไม่มีใน diff ที่ยังไม่ commit) | `CREATE OR REPLACE TABLE ... staging`, `BEGIN TRANSACTION` / `COMMIT` / `ROLLBACK` | DURING_EXAM | รูปแบบ atomic replace ตาม `PIPELINE_SPEC.md` |
| E016 | เนื้อหา `app/metrics.py` | SQL คำนวณ `workflow_completion_rate`, `step_dropoff_rate`, ฟังก์ชัน `pick_highest_dropoff_step` (tie-break ด้วย step_order ต่ำสุด) | DURING_EXAM | ความตรงกันระหว่างโค้ดกับสูตรใน METRIC_LOGIC.md |
| E017 | เนื้อหา `app/main.py` | endpoint `/api/upload`, `/api/workflows`, `/api/funnel`, `/api/status`, `/api/filters` | DURING_EXAM | ขอบเขต API ที่ implement จริง |
| E018 | เนื้อหา `app/validation.py` + `scripts/validate_input.py` | `validate(path, include_rows=False)` ใช้ร่วมกันระหว่าง CLI กับ web upload | DURING_EXAM | ไม่มีการเขียนกฎ validation ซ้ำซ้อนสองชุด |
| E019 | เนื้อหา `tests/test_metrics.py`, `tests/test_integration.py` | ชื่อเทสต์ เช่น `test_highest_dropoff_tie_break_uses_lowest_step_order`, `test_invalid_csv_is_rejected_and_active_dataset_is_preserved` | DURING_EXAM | ขอบเขตที่ automated test ครอบคลุมจริง |
| E020 | ผลลัพธ์ tool call `python3 -m pytest tests/ -q` หลายครั้งตลอด session | `"7 passed in 0.9Xs"` (ค่าเวลาต่างกันเล็กน้อยแต่ละครั้ง, จำนวนผ่านคงที่ 7) | DURING_EXAM (กระจายหลายจุด) | ผลรันจริง ไม่ใช่แค่โค้ดทดสอบที่มีอยู่ |
| E021 | เนื้อหา `Dockerfile` | `FROM python:3.12-slim`, `CMD ["python3","-m","uvicorn","app.main:app","--host","0.0.0.0","--port","8000"]` | DURING_EXAM | มี production-like startup command |
| E022 | ผลลัพธ์ tool call `docker build`/`docker run`/`curl` ต่อ container | `INDEX:200`, JSON response ของ `/api/status`, `/api/workflows` | DURING_EXAM | container ทำงานได้จริงแบบเดียวกับที่ Coolify จะรัน (ทดสอบ local เท่านั้น) |
| E023 | ผลลัพธ์ tool call `curl` ต่อ local uvicorn server หลายครั้ง | `{"active":true,"dataset":{"source_filename":"numnim_ux_funnel_mock.csv","row_count":21600,...}}` | DURING_EXAM | backend ทำงานจริงกับข้อมูลจริง ไม่ใช่ mock |
| E024 | ผลลัพธ์ tool call `playwright-cli` (open/click/snapshot/console/screenshot) หลายสิบครั้งตลอด session | `Total messages: 0 (Errors: 0, Warnings: 0)` (รอบท้าย), ภาพหน้าจอ dashboard ที่แสดงตัวเลขตรงกับ API | DURING_EXAM | UI ทำงานถูกต้องกับ backend จริงผ่านการทดสอบแบบโต้ตอบจริงในเบราว์เซอร์ |
| E025 | `ls .playwright-cli/` (อ่านอย่างเดียว) | ไฟล์ log/snapshot 30 ไฟล์ ช่วงเวลา `2026-10-02T03-55-48Z` ถึง `2026-10-02T05-05-08Z` | AFTER_EXAM (ตรวจตอนรวบรวม) แต่สะท้อนกิจกรรม DURING_EXAM | กรอบเวลากิจกรรมทดสอบ UI จริง (ตรงกับช่วง mtime ของไฟล์โค้ด) |
| E027 | ผลลัพธ์ `grep -rniE "openai\|anthropic\|...\|ai_model\|investigation.brief"` (อ่านอย่างเดียว) | พบเฉพาะข้อความในเอกสาร `DASHBOARD_SPEC.md`/`TASKS.md`/`BUSINESS_GLOSSARY.md` ว่าเป็นแผนที่ยังไม่ทำ | AFTER_EXAM | ไม่มีโค้ด AI bonus implementation จริง |
| E028 | `stat -f "%Sm %N" ...` (อ่านอย่างเดียว, ใช้เป็นหลักฐานประกอบเท่านั้น ไม่ใช่หลักฐานชี้ขาด) | mtime ของไฟล์หลักอยู่ในช่วง `Oct 2 10:33` ถึง `Oct 2 12:04 2026` | TIME_UNKNOWN (ใช้ mtime เป็นข้อมูลประกอบ ไม่ใช่หลักฐานชี้ขาดตามกติกา) | กรอบเวลาโดยประมาณของการทำงาน ไม่ยืนยันว่าทำทันเวลาสอบ |
| E029 | system context ต้น session ("userEmail") + `git log` author field | `userEmail: kanyanat.k@ragnar.co.th` ตรงกับ `Author: Kanyanat Kumkailng <kanyanat.k@ragnar.co.th>` | DURING_EXAM / AFTER_EXAM (ยืนยันซ้ำตอนรวบรวม) | ยืนยันตัวตนผู้สอบจากสองแหล่งที่สอดคล้องกัน |
| E031 | เนื้อหา `README.md`/`PROJECT_STATUS.md` หลังแก้ไขรอบ "synchronize documentation" | "python3 -m pytest tests/ -q — 7 tests, currently passing", คำสั่ง `docker build`/`docker run` ที่ตรงกับที่ทดสอบจริง | DURING_EXAM | เอกสารถูกปรับให้ตรงกับสถานะ implementation จริง ไม่ใช่การเขียนลอย ๆ |

---

### รายการที่กรรมการควรตรวจเพิ่มเติม (ไม่สามารถยืนยันได้ใน session นี้)

1. ยืนยันกับ GitHub จริงว่า commit `52529d0` (และ/หรือ commit ที่ใหม่กว่านั้นถ้ามีการ push เพิ่ม) ถูก push จริงและ**เวลาที่ push**เทียบกับ deadline สอบที่เป็นทางการ
2. ตรวจสอบว่ามี Coolify deployment จริงหรือไม่ — รายงานนี้ไม่พบหลักฐานใด ๆ เลย
3. ตรวจสอบว่าการเปลี่ยนแปลง "premium polish" ที่ยังไม่ commit ณ เวลารวบรวมหลักฐาน ถือเป็นส่วนหนึ่งของงานที่ส่งสอบหรือไม่ (ขึ้นกับ deadline จริงที่กรรมการทราบแต่ระบบนี้ไม่ทราบ)
4. สอบถามผู้สอบโดยตรงว่า commit ที่สอง ("1 commit") เกิดขึ้นเมื่อใดและด้วยเครื่องมือใด เพื่อยืนยันข้อสันนิษฐาน (INFERRED) ในรายงานนี้
5. ตรวจสอบเหตุผลที่เอกสาร DDD มีครบเฉพาะ 15 จาก 23 ไฟล์ตาม template — เป็นไปตามขอบเขต MVP ที่ตั้งใจหรือไม่ครบถ้วนตามแผน

*(รายงานนี้ไม่มีการประเมินคะแนนหรือสรุปผ่าน/ตกใด ๆ ตามขอบเขตที่กำหนด)*
