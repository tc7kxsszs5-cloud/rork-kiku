# RegressProof

First implementation scaffold for the `RegressProof` CLI.

Current scope:

- read project config
- collect git context
- resolve baseline reference
- calculate changed files
- run baseline quick checks from a snapshot
- run current quick checks in the target repo
- emit a structured run report with a first verdict
- write JSON and Markdown artifacts for CI usage
- append persistent ledger entries for later cost and fault analysis
- emit PR comment artifacts and support direct PR comment publishing in GitHub Actions

This is the proof-of-function shell for the MVP. It now performs baseline and current quick-check execution, splits multi-line failures into structured records, and returns an evidence-based first verdict.

Implementation note:

- the runtime is currently plain Node.js for reliability
- TypeScript source scaffolding is present for the next iteration
- the next milestone is deeper real-repo validation plus broader provider-specific usage support

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

Fixture repository note:

- the fixture directories currently preserve their own local git histories for controlled baseline/current validation
- because of that, they are not yet part of the first bootstrap commit in the main repository history
- they should be flattened or exported into plain tracked fixture directories before being imported into the main repository as normal files

## Commands

Build:

```bash
cd regressproof
npm run build
```

Run:

```bash
cd regressproof
node dist/cli.js run
```

Run with JSON output:

```bash
cd regressproof
node dist/cli.js run --format json
```

Run against fixtures:

```bash
cd regressproof
node src/cli.js run --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/simple-js --format json
node src/cli.js run --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/preexisting-js --format json
node src/cli.js run --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/mixed-js --format json
node src/cli.js run --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/build-js --format json
node src/cli.js run --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/lint-js --format json
node src/cli.js run --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/test-js --format json
node src/cli.js run --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/timeout-js --format json
node src/cli.js run --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/parser-js --format json
node src/cli.js run --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/python-js --format json
node src/cli.js run --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/swift-js --format json
```

Write artifacts explicitly:

```bash
cd regressproof
node src/cli.js run \
  --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/simple-js \
  --format json \
  --artifact-dir /Users/mac/Desktop/rork-kiku/regressproof-artifacts
```

Run in CI mode:

```bash
cd regressproof
node src/cli.js run \
  --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/simple-js \
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

Lightweight mode uses a skipped baseline for large repositories and is intended for smoke validation before richer real-repo support is added.

Current real-repo behavior is best understood as:

- a `self-hosted real-workspace smoke validation` path

This confirms that RegressProof can execute from inside the main workspace and complete a nested smoke check. It does not yet replace deeper committed-change validation for real repository edits.

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

For fixture repositories or other custom configs:

```bash
cd regressproof
node scripts/check-committed-range-readiness.js \
  --repo /Users/mac/Desktop/rork-kiku/regressproof/fixtures/lint-js \
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
