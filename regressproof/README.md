# RegressProof

`Proof, not guesses, for agent-caused regressions.`

RegressProof is a local CLI and CI validation layer for AI coding regressions. It compares a baseline snapshot against a current change, classifies what actually changed, and emits evidence-focused reports instead of intuition-only blame.

Current MVP capabilities:

- local CLI execution
- baseline vs current quick-check verification
- diff-aware changed-file mapping
- conservative verdict classes
- JSON and Markdown artifacts
- append-only internal ledger output
- tracked fixture suite for reproducible validation
- real-repo trust scenarios for self-validation inside this repository

The runtime is plain Node.js. In this repository, the most reliable commands are `node ...` commands first; `npm run ...` is only a convenience layer when `npm` is available in the environment.

Validated fixture coverage currently includes:

- `simple-js`
- `lint-js`
- `preexisting-js`
- `mixed-js`
- `build-js`
- `test-js`
- `timeout-js`
- `parser-js`
- `python-js`
- `swift-js`

Primary fixture model:

- tracked scenario packs under each fixture directory
- `tracked/baseline`
- `tracked/current`
- `fixture.materializer.json`
- the tracked-pack suite now passes `10/10`

## Quick Start

Verify the whole MVP in one shot:

```bash
cd /Users/mac/Desktop/rork-kiku
node regressproof/scripts/verify-mvp.js --repo /Users/mac/Desktop/rork-kiku --out-dir /tmp/regressproof-mvp
```

This is the main "does the repo work?" command. It runs:

- the full tracked fixture suite
- the committed real-repo trust scenario
- the deeper committed real-repo scenario

The final summary lands in:

- `/tmp/regressproof-mvp/regressproof-mvp-summary.json`

Run the fixture suite only:

```bash
cd /Users/mac/Desktop/rork-kiku
node regressproof/scripts/run-all-fixtures.js --out-dir /tmp/regressproof-fixtures
```

Run the main committed trust scenario:

```bash
cd /Users/mac/Desktop/rork-kiku
node regressproof/scripts/verify-real-repo-trust-scenario.js --repo /Users/mac/Desktop/rork-kiku --out-dir /tmp/regressproof-real-scenario
```

Run the deeper committed trust scenario:

```bash
cd /Users/mac/Desktop/rork-kiku
node regressproof/scripts/verify-real-repo-deep-scenario.js --repo /Users/mac/Desktop/rork-kiku --out-dir /tmp/regressproof-real-deep-scenario
```

If `npm` is available, the same entrypoints are exposed as:

```bash
cd /Users/mac/Desktop/rork-kiku/regressproof
npm run verify:mvp
```

## CLI Usage

Direct local run:

```bash
cd /Users/mac/Desktop/rork-kiku/regressproof
node src/cli.js run --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/simple-js --format json
```

Build `dist/` explicitly:

```bash
cd /Users/mac/Desktop/rork-kiku/regressproof
node scripts/build.js
```

Preferred fixture flow:

1. materialize the fixture into a temp git repo
2. run RegressProof against that temp repo

Example:

```bash
cd regressproof
node scripts/materialize-fixture.js \
  --fixture /Users/mac/Desktop/rork-kiku/regressproof/fixtures/lint-js \
  --out-dir /tmp/regressproof-materialized-lint

node src/cli.js run \
  --repo /tmp/regressproof-materialized-lint/repo \
  --config /tmp/regressproof-materialized-lint/repo/regressproof.config.json \
  --format json
```

Fixture materialization helper:

```bash
cd regressproof
npm run fixture:materialize -- --fixture /Users/mac/Desktop/rork-kiku/regressproof/fixtures/lint-js
```

Current materializer behavior:

- tracked scenario packs are materialized into temporary git repos first
- embedded fixture repos are treated only as import sources when exporting packs
- baseline and current snapshots are exported alongside the temp repo

Fixture scenario-pack export helper:

```bash
cd regressproof
npm run fixture:export-pack -- --fixture /Users/mac/Desktop/rork-kiku/regressproof/fixtures/lint-js
```

This exports `baseline` and `current` trees under `tracked/` and writes `fixture.materializer.json`, which makes the tracked scenario-pack path self-contained.

Bulk scenario-pack export:

```bash
cd regressproof
node scripts/export-all-fixture-packs.js
```

This walks every fixture source and refreshes tracked `baseline/current` packs.

Fixture suite runner:

```bash
cd /Users/mac/Desktop/rork-kiku
node regressproof/scripts/run-all-fixtures.js
```

This runner:

- materializes each fixture
- runs RegressProof against the materialized repo
- continues through the whole suite without stopping on the first failure
- writes a JSON summary plus per-fixture artifacts under a temporary output directory

Current tracked-pack suite result:

- `10/10 passed`
- summary example: `/tmp/regressproof-suite-now/fixture-suite-summary.json`

Write artifacts explicitly from a materialized fixture:

```bash
cd regressproof
node scripts/materialize-fixture.js \
  --fixture /Users/mac/Desktop/rork-kiku/regressproof/fixtures/simple-js \
  --out-dir /tmp/regressproof-materialized-simple

node src/cli.js run \
  --repo /tmp/regressproof-materialized-simple/repo \
  --config /tmp/regressproof-materialized-simple/repo/regressproof.config.json \
  --format json \
  --artifact-dir /Users/mac/Desktop/rork-kiku/regressproof-artifacts
```

Run in CI mode:

```bash
cd regressproof
node scripts/materialize-fixture.js \
  --fixture /Users/mac/Desktop/rork-kiku/regressproof/fixtures/simple-js \
  --out-dir /tmp/regressproof-materialized-simple

node src/cli.js run \
  --repo /tmp/regressproof-materialized-simple/repo \
  --config /tmp/regressproof-materialized-simple/repo/regressproof.config.json \
  --format json \
  --artifact-dir /Users/mac/Desktop/rork-kiku/regressproof-artifacts \
  --ci
```

In CI mode, RegressProof exits non-zero only for configured verdicts such as `confirmed_agent_fault`.

Run against the current repository in lightweight mode:

```bash
cd regressproof
node src/cli.js run \
  --repo /Users/mac/Desktop/rork-kiku \
  --config regressproof/regressproof.real-repo.config.json \
  --format json
```

Lightweight mode uses the real-repo trust-check entrypoint and is intended for self-validation inside a larger workspace.

Current real-repo behavior is best understood as:

- a `self-hosted real-workspace trust validation` path

This confirms that RegressProof can execute from inside the main workspace and complete a nested trust check that exercises tracked fixture materialization plus expected verdict handling. It does not yet replace deeper committed-change validation for real repository edits.

The real-repo path now uses a committed-boundary trust-check built on tracked scenario packs and the shared fixture suite runner.

This keeps committed validation runnable while the main repository history is still being deepened.

Committed validation helper:

```bash
cd regressproof
npm run real:committed -- --repo /Users/mac/Desktop/rork-kiku --artifact-dir /tmp/regressproof-committed-pass
```

Optional explicit compare ref:

```bash
cd regressproof
npm run real:committed -- \
  --repo /Users/mac/Desktop/rork-kiku \
  --head-ref HEAD \
  --artifact-dir /tmp/regressproof-committed-pass
```

The committed helper computes a baseline ref automatically, prepares a temporary config, and runs the real-repo validation flow against committed history.

Committed readiness helper:

```bash
cd regressproof
npm run real:readiness -- --repo /Users/mac/Desktop/rork-kiku
```

Use this before committed validation when you are unsure whether the selected git range actually contains the RegressProof boundary in committed history.

Committed trust-scenario helper:

```bash
cd regressproof
npm run real:scenario -- --repo /Users/mac/Desktop/rork-kiku
```

This runs the current committed trust scenario end-to-end and asserts the expected invariants:

- readiness is `ready`
- `diffRange` is `HEAD~1..HEAD`
- baseline mode is `path_snapshot`
- current mode is `snapshot`
- committed verdict is `successful_change`
- confidence is `high`

Committed deep trust-scenario helper:

```bash
cd regressproof
npm run real:scenario:deep -- --repo /Users/mac/Desktop/rork-kiku
```

This uses the `deep` trust-check profile so the committed path exercises a broader nested fixture subset:

- `lint-js`
- `preexisting-js`
- `parser-js`
- `python-js`

## GitHub Action

The repository includes a GitHub Action at:

- `/Users/mac/Desktop/rork-kiku/.github/workflows/regressproof.yml`

That workflow now validates the RegressProof MVP directly by running:

- `node regressproof/scripts/verify-mvp.js`

and uploads the full artifact tree under `regressproof-artifacts/`.

For materialized fixtures or other custom configs:

```bash
cd regressproof
node scripts/check-committed-range-readiness.js \
  --repo /tmp/regressproof-materialized-lint/repo \
  --config regressproof.config.json \
  --baseline-ref HEAD~1 \
  --head-ref HEAD
```

Committed validation now supports:

- explicit `baselineRef..compareRef` attribution
- diff calculation against a selected committed ref
- snapshot execution for the compared commit, so current verification is not tied to the live checkout
- richer git context in reports:
  - `baselineCommit`
  - `compareRef`
  - `compareCommit`
  - `diffRange`
  - `currentMode`

When the selected committed ref still does not contain the RegressProof project boundary, the runner now degrades gracefully instead of crashing:

- baseline path snapshots can fall back to `skip`
- current commit execution can fall back to `worktree_fallback` when the compared ref resolves to the live `HEAD` commit but the project still exists mainly in the working tree

Workspace validation helper:

```bash
cd regressproof
npm run real:workspace -- --repo /Users/mac/Desktop/rork-kiku --artifact-dir /tmp/regressproof-workspace-pass
```

The workspace helper compares `HEAD` to the current worktree for the RegressProof project boundary. This is useful when the project exists mostly as working-tree changes rather than committed repository history.

Standalone export helper:

```bash
cd regressproof
npm run export:standalone
```

Optional custom destination:

```bash
cd regressproof
npm run export:standalone -- --out-dir /tmp/regressproof-standalone
```

This creates a near-standalone repository shape with:

- the RegressProof package boundary
- core `src/`, `scripts/`, and `fixtures/`
- local packaging files such as `.gitignore` and `AGENTS.md`
- copied canonical RegressProof docs under `docs/`

The export intentionally excludes build artifacts so the resulting package stays clean and reproducible.

Exact usage modes:

- `usage.mode = "estimated"` uses config or heuristic estimation
- `usage.mode = "exact"` supports:
  - env ingestion via `REGRESSPROOF_PROMPT_TOKENS`, `REGRESSPROOF_COMPLETION_TOKENS`, `REGRESSPROOF_CACHED_TOKENS`, `REGRESSPROOF_COST_USD`
  - file ingestion via `usage.exact.filePath`

Persistent ledger:

- by default, a JSONL ledger is written under the artifact directory in `.regressproof-ledger/runs.jsonl`
- each run records verdict, confidence, spend estimate, internal credit, and failure counts

Current report artifacts include:

- `regressproof-report.json`
- `regressproof-summary.md`
- `regressproof-pr-summary.md`
- `regressproof-pr-comment.md`
- `.regressproof-ledger/runs.jsonl`

Current reporting behavior includes:

- human-readable verdict headlines
- explicit counts for introduced, preexisting, unchanged, and fixed failures
- PR-oriented compact summaries and comment bodies
- grouped multi-line evidence for more realistic parser-targeted scenarios
