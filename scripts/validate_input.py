#!/usr/bin/env python3
import csv
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

REQUIRED = [
    "organization_id",
    "period_month",
    "workflow_name",
    "step_order",
    "step_name",
    "started_count",
    "completed_count",
]
KEY = ["organization_id", "period_month", "workflow_name", "step_order"]

def fail(errors, msg):
    errors.append(msg)

def validate(path: Path, include_rows: bool = False):
    errors = []
    rows = []
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        if reader.fieldnames != REQUIRED:
            fail(errors, f"columns must equal {REQUIRED}; got {reader.fieldnames}")
            return {"status": "failed", "errors": errors}
        for line_no, row in enumerate(reader, start=2):
            if any(row[c] is None or row[c] == "" for c in REQUIRED):
                fail(errors, f"line {line_no}: required value missing")
                continue
            try:
                row["step_order"] = int(row["step_order"])
                row["started_count"] = int(row["started_count"])
                row["completed_count"] = int(row["completed_count"])
            except ValueError:
                fail(errors, f"line {line_no}: numeric parse failed")
                continue
            if row["step_order"] < 1:
                fail(errors, f"line {line_no}: step_order < 1")
            if row["started_count"] < 0 or row["completed_count"] < 0:
                fail(errors, f"line {line_no}: negative count")
            if row["completed_count"] > row["started_count"]:
                fail(errors, f"line {line_no}: completed_count > started_count")
            rows.append(row)

    key_counter = Counter(tuple(str(row[c]) for c in KEY) for row in rows)
    duplicates = [k for k, count in key_counter.items() if count > 1]
    if duplicates:
        fail(errors, f"duplicate natural keys: {len(duplicates)}")

    step_names = defaultdict(set)
    groups = defaultdict(list)
    for row in rows:
        step_names[(row["workflow_name"], row["step_order"])].add(row["step_name"])
        groups[(row["organization_id"], row["period_month"], row["workflow_name"])].append(row)

    conflicts = [k for k, names in step_names.items() if len(names) > 1]
    if conflicts:
        fail(errors, f"workflow/step name conflicts: {len(conflicts)}")

    continuity_mismatches = 0
    sequence_errors = 0
    transitions = 0
    for group_rows in groups.values():
        ordered = sorted(group_rows, key=lambda r: r["step_order"])
        seq = [r["step_order"] for r in ordered]
        if not seq or seq[0] != 1 or seq != list(range(1, seq[-1] + 1)):
            sequence_errors += 1
            continue
        for prev, curr in zip(ordered, ordered[1:]):
            transitions += 1
            if curr["started_count"] != prev["completed_count"]:
                continuity_mismatches += 1
    if sequence_errors:
        fail(errors, f"step sequence errors: {sequence_errors}")
    if continuity_mismatches:
        fail(errors, f"cross-step continuity mismatches: {continuity_mismatches}")

    result = {
        "status": "passed" if not errors else "failed",
        "file": path.name,
        "row_count": len(rows),
        "organization_count": len({r["organization_id"] for r in rows}),
        "period_count": len({r["period_month"] for r in rows}),
        "period_min": min((r["period_month"] for r in rows), default=None),
        "period_max": max((r["period_month"] for r in rows), default=None),
        "workflow_count": len({r["workflow_name"] for r in rows}),
        "workflows": sorted({r["workflow_name"] for r in rows}),
        "group_count": len(groups),
        "transition_count": transitions,
        "errors": errors,
    }
    if include_rows:
        result["rows"] = rows
    return result

def main():
    path = Path(sys.argv[1] if len(sys.argv) > 1 else "data/raw/numnim_ux_funnel_mock.csv")
    result = validate(path)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(0 if result["status"] == "passed" else 1)

if __name__ == "__main__":
    main()
