#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

ts="$(date +"%Y-%m-%d_%H-%M-%S")"
out="$root/local/session-logs/session_$ts.md"
tmpl="$root/docs/development/SESSION_LOG_TEMPLATE.md"

mkdir -p "$(dirname "$out")"

if [[ -f "$tmpl" ]]; then
  cp "$tmpl" "$out"
else
  cat <<'TEMPLATE' > "$out"
# Session Log

Date:
Start:
End:
People:

Goal

Context

Work Done

Commands Run

Decisions

Risks / Follow-ups

Artifacts (files/links)

Notes
TEMPLATE
fi

echo "$out"
