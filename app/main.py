"""FastAPI entrypoint for the UX Workflow Funnel Dashboard.

Pipeline: CSV upload -> schema/type validation -> funnel consistency
validation -> DuckDB transaction -> metric queries -> dashboard
(docs/analytics/PIPELINE_SPEC.md).
"""
from __future__ import annotations

import os
import tempfile
import threading
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app import db, metrics
from app.validation import validate_csv_file

ROOT_DIR = Path(__file__).resolve().parent.parent
DB_PATH = Path(
    os.environ.get(
        "UX_FUNNEL_DB_PATH", str(ROOT_DIR / "data" / "app" / "ux_workflow_funnel.duckdb")
    )
)
FIXTURE_PATH = ROOT_DIR / "data" / "raw" / "numnim_ux_funnel_mock.csv"
STATIC_DIR = Path(__file__).resolve().parent / "static"

app = FastAPI(title="UX Workflow Funnel Dashboard")

_db_lock = threading.Lock()
_connection = None


def get_connection():
    global _connection
    if _connection is None:
        _connection = db.connect(DB_PATH)
    return _connection


@app.on_event("startup")
def on_startup() -> None:
    """Load the validated fixture CSV only when no active dataset exists yet,
    so a prior upload (or a prior process run against the same DuckDB file)
    is never silently overwritten."""
    con = get_connection()
    with _db_lock:
        if not db.has_active_dataset(con) and FIXTURE_PATH.exists():
            result = validate_csv_file(FIXTURE_PATH, include_rows=True)
            if result["status"] == "passed":
                rows = result.pop("rows")
                db.replace_active_dataset(con, rows, result, FIXTURE_PATH.name)


@app.get("/api/status")
def api_status():
    con = get_connection()
    with _db_lock:
        info = db.get_active_dataset_info(con)
    return {"active": info is not None, "dataset": info}


@app.get("/api/filters")
def api_filters():
    con = get_connection()
    with _db_lock:
        if not db.has_active_dataset(con):
            return {"organizations": [], "periods": [], "workflows": []}
        return metrics.get_filter_options(con)


@app.get("/api/workflows")
def api_workflows(
    organization_id: Optional[List[str]] = Query(None),
    period_month: Optional[List[str]] = Query(None),
):
    con = get_connection()
    with _db_lock:
        if not db.has_active_dataset(con):
            return []
        return metrics.get_workflow_completion(con, organization_id, period_month)


@app.get("/api/funnel")
def api_funnel(
    workflow_name: str,
    organization_id: Optional[List[str]] = Query(None),
    period_month: Optional[List[str]] = Query(None),
):
    con = get_connection()
    with _db_lock:
        if not db.has_active_dataset(con):
            return {"steps": [], "highest_dropoff_step": None}
        steps = metrics.get_step_metrics(con, workflow_name, organization_id, period_month)
        highest = metrics.pick_highest_dropoff_step(steps)
        return {"steps": steps, "highest_dropoff_step": highest}


@app.post("/api/upload")
async def api_upload(file: UploadFile = File(...)):
    suffix = Path(file.filename or "upload.csv").suffix or ".csv"
    content = await file.read()
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(content)
        tmp_path = Path(tmp.name)

    try:
        try:
            result = validate_csv_file(tmp_path, include_rows=True)
        except Exception as exc:
            raise HTTPException(
                status_code=422,
                detail={"status": "failed", "errors": [f"could not parse file: {exc}"]},
            )
    finally:
        tmp_path.unlink(missing_ok=True)

    rows = result.pop("rows", [])
    if result["status"] != "passed":
        raise HTTPException(status_code=422, detail=result)

    con = get_connection()
    with _db_lock:
        db.replace_active_dataset(con, rows, result, file.filename or tmp_path.name)
    return result


app.mount("/assets", StaticFiles(directory=STATIC_DIR), name="assets")


@app.get("/")
def index():
    return FileResponse(STATIC_DIR / "index.html")
