"""Metric queries.

Formulas and SQL shape are owned by docs/analytics/METRIC_SPEC.md and
docs/analytics/METRIC_LOGIC.md. This module only parameterizes the optional
organization_id / period_month filter scope described there; it does not
introduce any competing metric formula (counts are summed before ratios are
computed, per METRIC_LOGIC.md).
"""
from __future__ import annotations

from typing import Optional

import duckdb

from app.db import FACT_TABLE


def _filter_clause(
    organization_ids: Optional[list[str]], period_months: Optional[list[str]]
) -> tuple[str, list]:
    clauses = []
    params: list = []
    if organization_ids:
        placeholders = ", ".join(["?"] * len(organization_ids))
        clauses.append(f"organization_id IN ({placeholders})")
        params.extend(organization_ids)
    if period_months:
        placeholders = ", ".join(["?"] * len(period_months))
        clauses.append(f"period_month IN ({placeholders})")
        params.extend(period_months)
    where_sql = " AND ".join(clauses) if clauses else "1 = 1"
    return where_sql, params


def get_filter_options(con: duckdb.DuckDBPyConnection) -> dict:
    organizations = [
        r[0]
        for r in con.execute(
            f"SELECT DISTINCT organization_id FROM {FACT_TABLE} ORDER BY organization_id"
        ).fetchall()
    ]
    periods = [
        r[0]
        for r in con.execute(
            f"SELECT DISTINCT period_month FROM {FACT_TABLE} ORDER BY period_month"
        ).fetchall()
    ]
    workflows = [
        r[0]
        for r in con.execute(
            f"SELECT DISTINCT workflow_name FROM {FACT_TABLE} ORDER BY workflow_name"
        ).fetchall()
    ]
    return {"organizations": organizations, "periods": periods, "workflows": workflows}


def get_workflow_completion(
    con: duckdb.DuckDBPyConnection,
    organization_ids: Optional[list[str]] = None,
    period_months: Optional[list[str]] = None,
) -> list[dict]:
    where_sql, params = _filter_clause(organization_ids, period_months)
    sql = f"""
        WITH scoped AS (
            SELECT
                workflow_name,
                step_order,
                SUM(started_count) AS step_started,
                SUM(completed_count) AS step_completed
            FROM {FACT_TABLE}
            WHERE {where_sql}
            GROUP BY workflow_name, step_order
        ), bounds AS (
            SELECT
                workflow_name,
                MIN(step_order) AS first_step,
                MAX(step_order) AS last_step
            FROM scoped
            GROUP BY workflow_name
        )
        SELECT
            s.workflow_name,
            MAX(CASE WHEN s.step_order = b.first_step THEN s.step_started END) AS workflow_started,
            MAX(CASE WHEN s.step_order = b.last_step THEN s.step_completed END) AS workflow_completed,
            CASE
                WHEN MAX(CASE WHEN s.step_order = b.first_step THEN s.step_started END) = 0 THEN NULL
                ELSE MAX(CASE WHEN s.step_order = b.last_step THEN s.step_completed END)::DOUBLE
                     / MAX(CASE WHEN s.step_order = b.first_step THEN s.step_started END)
            END AS workflow_completion_rate
        FROM scoped s
        JOIN bounds b USING (workflow_name)
        GROUP BY s.workflow_name
        ORDER BY s.workflow_name
    """
    cols = ["workflow_name", "workflow_started", "workflow_completed", "workflow_completion_rate"]
    return [dict(zip(cols, row)) for row in con.execute(sql, params).fetchall()]


def get_step_metrics(
    con: duckdb.DuckDBPyConnection,
    workflow_name: Optional[str] = None,
    organization_ids: Optional[list[str]] = None,
    period_months: Optional[list[str]] = None,
) -> list[dict]:
    where_sql, params = _filter_clause(organization_ids, period_months)
    if workflow_name:
        where_sql = f"{where_sql} AND workflow_name = ?"
        params = params + [workflow_name]
    sql = f"""
        WITH step_metrics AS (
            SELECT
                workflow_name,
                step_order,
                step_name,
                SUM(started_count) AS step_started,
                SUM(completed_count) AS step_completed,
                SUM(started_count) - SUM(completed_count) AS step_dropoff_count,
                CASE
                    WHEN SUM(started_count) = 0 THEN NULL
                    ELSE (SUM(started_count) - SUM(completed_count))::DOUBLE
                         / SUM(started_count)
                END AS step_dropoff_rate
            FROM {FACT_TABLE}
            WHERE {where_sql}
            GROUP BY workflow_name, step_order, step_name
        )
        SELECT *
        FROM step_metrics
        ORDER BY workflow_name, step_order
    """
    cols = [
        "workflow_name",
        "step_order",
        "step_name",
        "step_started",
        "step_completed",
        "step_dropoff_count",
        "step_dropoff_rate",
    ]
    return [dict(zip(cols, row)) for row in con.execute(sql, params).fetchall()]


def pick_highest_dropoff_step(step_rows: list[dict]) -> Optional[dict]:
    """Max step_dropoff_rate; ties broken by lowest step_order (METRIC_SPEC.md)."""
    candidates = [r for r in step_rows if r["step_dropoff_rate"] is not None]
    if not candidates:
        return None
    return max(candidates, key=lambda r: (r["step_dropoff_rate"], -r["step_order"]))
