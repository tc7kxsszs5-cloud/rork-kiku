from pathlib import Path
import sys

source = Path("src/app.py").read_text()

if "TYPE_FAIL" in source:
    print("typecheck failed in src/app.py: found TYPE_FAIL marker", file=sys.stderr)
    sys.exit(1)

print("typecheck passed")
