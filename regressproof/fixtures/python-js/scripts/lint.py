from pathlib import Path
import sys

source = Path("src/app.py").read_text()

if "LINT_FAIL" in source:
    print("lint failed in src/app.py: found LINT_FAIL marker", file=sys.stderr)
    sys.exit(1)

print("lint passed")
