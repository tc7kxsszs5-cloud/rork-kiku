# AGENTS.md

This directory is the packaging boundary for the `RegressProof` CLI.

## Subproject Goal

Treat `regressproof/` as the closest thing to a standalone repository inside the larger workspace.

When working here, prioritize:

- CLI reliability
- verification fidelity
- fixture coverage
- real-repo validation
- exportability into a standalone repo shape

## Source Of Truth

Read these documents before making major changes:

1. `../docs/REGRESSPROOF_INDEX.md`
2. `../docs/REGRESSPROOF_PRODUCT_BRIEF.md`
3. `../docs/REGRESSPROOF_SPEC.md`
4. `../docs/REGRESSPROOF_IMPLEMENTATION_PLAN.md`
5. `../docs/REGRESSPROOF_MVP_TASK_BREAKDOWN.md`
6. `../docs/REGRESSPROOF_VALIDATION_PLAN.md`
7. `../docs/REGRESSPROOF_DECISION_LOG.md`

## Working Rules

- Keep the product framed as proof-based regression detection and accountability.
- Preserve conservative verdict behavior and confidence scoring.
- Keep fixture coverage broad enough to prove behavior across languages and error shapes.
- Prefer portable Node.js and file-based workflows for MVP packaging.
- When changing packaging or export behavior, update both `README.md` and the relevant `docs/REGRESSPROOF_*.md` file.

## Packaging Direction

Near-term packaging work should make this directory easier to:

- understand in isolation
- export into a standalone repository
- run locally without depending on the full workspace layout

Do not optimize for npm publishing before the standalone project boundary is proven.
