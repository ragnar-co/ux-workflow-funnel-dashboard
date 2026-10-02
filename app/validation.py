"""CSV validation for uploaded workflow-funnel source files.

Rules are owned by docs/analytics/DATA_QUALITY.md. This module reuses the
exact same rule implementation as scripts/validate_input.py (the repository's
canonical CLI validator) so the upload path and the CLI re-run path can never
drift from each other.
"""
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from scripts.validate_input import validate as validate_csv_file  # noqa: E402

__all__ = ["validate_csv_file"]
