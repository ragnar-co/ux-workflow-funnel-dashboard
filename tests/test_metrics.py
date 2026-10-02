"""Metric validation tests against a small golden fixture with known values.

Formulas under test are owned by docs/analytics/METRIC_SPEC.md /
docs/analytics/METRIC_LOGIC.md. Values here are invented purely for this
fixture, not project KPI targets.
"""
from pathlib import Path

from app import db, metrics
from app.validation import validate_csv_file

FIXTURE = Path(__file__).parent / "fixtures" / "golden_funnel.csv"


def _load_golden(tmp_path, name):
    con = db.connect(tmp_path / name)
    result = validate_csv_file(FIXTURE, include_rows=True)
    assert result["status"] == "passed"
    rows = result.pop("rows")
    db.replace_active_dataset(con, rows, result, FIXTURE.name)
    return con


def test_step_dropoff_count_and_rate(tmp_path):
    con = _load_golden(tmp_path, "golden1.duckdb")
    steps = metrics.get_step_metrics(con, workflow_name="Demo Flow")
    by_order = {s["step_order"]: s for s in steps}

    assert by_order[1]["step_dropoff_count"] == 20
    assert by_order[1]["step_dropoff_rate"] == 20 / 100
    assert by_order[2]["step_dropoff_count"] == 60
    assert by_order[2]["step_dropoff_rate"] == 60 / 80
    assert by_order[3]["step_dropoff_count"] == 10
    assert by_order[3]["step_dropoff_rate"] == 10 / 20


def test_highest_dropoff_step_selects_max_rate(tmp_path):
    con = _load_golden(tmp_path, "golden2.duckdb")
    steps = metrics.get_step_metrics(con, workflow_name="Demo Flow")
    highest = metrics.pick_highest_dropoff_step(steps)
    assert highest["step_order"] == 2
    assert highest["step_dropoff_rate"] == 60 / 80


def test_workflow_completion_rate_is_final_over_first(tmp_path):
    con = _load_golden(tmp_path, "golden3.duckdb")
    overview = metrics.get_workflow_completion(con)
    assert len(overview) == 1
    row = overview[0]
    assert row["workflow_started"] == 100
    assert row["workflow_completed"] == 10
    assert row["workflow_completion_rate"] == 10 / 100


def test_highest_dropoff_tie_break_uses_lowest_step_order():
    rows = [
        {"step_order": 1, "step_dropoff_rate": 0.5},
        {"step_order": 2, "step_dropoff_rate": 0.5},
        {"step_order": 3, "step_dropoff_rate": 0.1},
    ]
    highest = metrics.pick_highest_dropoff_step(rows)
    assert highest["step_order"] == 1


def test_zero_started_count_dropoff_rate_is_null(tmp_path):
    con = db.connect(tmp_path / "zero.duckdb")
    con.execute(
        "INSERT INTO fct_workflow_funnel_step VALUES ('ORG-Z', '2026-01', 'Zero Flow', 1, 'Start', 0, 0)"
    )
    steps = metrics.get_step_metrics(con, workflow_name="Zero Flow")
    assert steps[0]["step_dropoff_rate"] is None
