"""DuckDB persistence for fct_workflow_funnel_step.

Schema and grain come from docs/analytics/DATA_MODEL_SPEC.md.
Load strategy (validated full-file atomic replace via a staging table inside
a single transaction) comes from docs/analytics/PIPELINE_SPEC.md.

period_month is stored as VARCHAR holding a validated `YYYY-MM` string
(DATA_MODEL_SPEC.md's "validated month representation" option) rather than
DATE, because the source grain has no day component.
"""
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import duckdb

FACT_TABLE = "fct_workflow_funnel_step"

FACT_COLUMNS_SQL = """
    organization_id VARCHAR NOT NULL,
    period_month VARCHAR NOT NULL,
    workflow_name VARCHAR NOT NULL,
    step_order INTEGER NOT NULL,
    step_name VARCHAR NOT NULL,
    started_count BIGINT NOT NULL,
    completed_count BIGINT NOT NULL,
    PRIMARY KEY (organization_id, period_month, workflow_name, step_order)
"""

INSERT_COLUMNS = [
    "organization_id",
    "period_month",
    "workflow_name",
    "step_order",
    "step_name",
    "started_count",
    "completed_count",
]

META_COLUMNS = [
    "source_filename",
    "imported_at",
    "row_count",
    "organization_count",
    "period_count",
    "period_min",
    "period_max",
    "workflow_count",
]


def connect(db_path: Path) -> duckdb.DuckDBPyConnection:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    con = duckdb.connect(str(db_path))
    con.execute(f"CREATE TABLE IF NOT EXISTS {FACT_TABLE} ({FACT_COLUMNS_SQL})")
    con.execute(
        """
        CREATE TABLE IF NOT EXISTS import_meta (
            id INTEGER PRIMARY KEY,
            source_filename VARCHAR,
            imported_at VARCHAR,
            row_count BIGINT,
            organization_count BIGINT,
            period_count BIGINT,
            period_min VARCHAR,
            period_max VARCHAR,
            workflow_count BIGINT
        )
        """
    )
    return con


def has_active_dataset(con: duckdb.DuckDBPyConnection) -> bool:
    (count,) = con.execute(f"SELECT COUNT(*) FROM {FACT_TABLE}").fetchone()
    return count > 0


def replace_active_dataset(
    con: duckdb.DuckDBPyConnection,
    rows: list[dict],
    validation_summary: dict,
    source_filename: str,
) -> None:
    """Atomically replace the active fact table with already-validated rows.

    On any failure the transaction is rolled back and the previously active
    dataset remains untouched (PIPELINE_SPEC.md error-handling rule).
    """
    con.execute("BEGIN TRANSACTION")
    try:
        con.execute(
            f"CREATE OR REPLACE TABLE {FACT_TABLE}_staging ({FACT_COLUMNS_SQL})"
        )
        if rows:
            con.executemany(
                f"INSERT INTO {FACT_TABLE}_staging VALUES (?, ?, ?, ?, ?, ?, ?)",
                [[r[c] for c in INSERT_COLUMNS] for r in rows],
            )
        con.execute(
            f"CREATE OR REPLACE TABLE {FACT_TABLE} AS SELECT * FROM {FACT_TABLE}_staging"
        )
        con.execute(f"DROP TABLE {FACT_TABLE}_staging")
        con.execute("DELETE FROM import_meta WHERE id = 1")
        con.execute(
            "INSERT INTO import_meta VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                source_filename,
                datetime.now(timezone.utc).isoformat(),
                *[validation_summary[c] for c in META_COLUMNS[2:]],
            ],
        )
        con.execute("COMMIT")
    except Exception:
        con.execute("ROLLBACK")
        raise


def get_active_dataset_info(con: duckdb.DuckDBPyConnection) -> Optional[dict]:
    row = con.execute(
        f"SELECT {', '.join(META_COLUMNS)} FROM import_meta WHERE id = 1"
    ).fetchone()
    if row is None:
        return None
    return dict(zip(META_COLUMNS, row))
