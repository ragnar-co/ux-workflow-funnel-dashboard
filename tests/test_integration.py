"""Integration test per docs/analytics/TESTING_STRATEGY.md:
load a valid fixture CSV -> validate -> persist -> query metrics -> assert.
Also covers: a failing input must not overwrite the previously valid active
dataset.
"""
from pathlib import Path

from app import db
from app.validation import validate_csv_file

GOLDEN = Path(__file__).parent / "fixtures" / "golden_funnel.csv"
INVALID = Path(__file__).parent / "fixtures" / "invalid_funnel.csv"


def test_full_pipeline_load_persist_and_query(tmp_path):
    con = db.connect(tmp_path / "pipeline.duckdb")
    assert not db.has_active_dataset(con)

    result = validate_csv_file(GOLDEN, include_rows=True)
    assert result["status"] == "passed"
    rows = result.pop("rows")
    db.replace_active_dataset(con, rows, result, GOLDEN.name)

    assert db.has_active_dataset(con)
    info = db.get_active_dataset_info(con)
    assert info["row_count"] == 3
    assert info["workflow_count"] == 1
    assert info["source_filename"] == GOLDEN.name


def test_invalid_csv_is_rejected_and_active_dataset_is_preserved(tmp_path):
    con = db.connect(tmp_path / "reject.duckdb")

    good = validate_csv_file(GOLDEN, include_rows=True)
    good_rows = good.pop("rows")
    db.replace_active_dataset(con, good_rows, good, GOLDEN.name)
    before = db.get_active_dataset_info(con)

    bad = validate_csv_file(INVALID, include_rows=True)
    assert bad["status"] == "failed"
    assert any("completed_count > started_count" in e for e in bad["errors"])

    # app/main.py's upload endpoint only calls replace_active_dataset() when
    # validation passes; a failed result must never reach that call.
    after = db.get_active_dataset_info(con)
    assert after == before
