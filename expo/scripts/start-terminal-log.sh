#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

ts="$(date +"%Y-%m-%d_%H-%M-%S")"
out="$root/local/terminal-logs/terminal_$ts.log"

mkdir -p "$(dirname "$out")"

echo "Logging terminal session to: $out"

if command -v script >/dev/null 2>&1; then
  script -q "$out"
else
  echo "The 'script' command is not available on this system." >&2
  exit 1
fi
