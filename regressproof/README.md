# RegressProof

`Proof, not guesses, for agent-caused regressions.`

RegressProof is a standalone CLI and GitHub Action utility for detecting measurable AI coding regressions.
It compares a baseline against a changed state, runs verification commands, maps failures to diffs, and produces evidence-focused reports instead of intuition-only blame.

## MVP Scope

Current MVP capabilities:

- local CLI execution
- GitHub Action / CI execution
- baseline vs current quick-check verification
- diff-aware changed-file mapping
- conservative verdict classes
- JSON and Markdown artifacts
- append-only internal ledger output
- tracked fixture packs for reproducible validation
- committed real-repo trust scenarios

Current verdict classes:

- `successful_change`
- `confirmed_agent_fault`
- `preexisting_failure`
- `environment_failure`
- `insufficient_evidence`

## Quick Start

Install dependencies and build:

```bash
npm install
npm run build
```

Run the main MVP verification flow:

```bash
npm run verify:mvp
```

This runs:

- the tracked fixture suite
- the committed trust scenario
- the deeper committed trust scenario

The final summary is written to:

- `/tmp/regressproof-mvp-*/regressproof-mvp-summary.json`

## Core Commands

Run the fixture suite:

```bash
npm run fixtures:run-all
```

Run the committed trust scenario against the current repository:

```bash
npm run real:scenario
```

Run the deeper committed trust scenario:

```bash
npm run real:scenario:deep
```

Run committed validation directly:

```bash
npm run real:committed -- --repo .
```

Check whether a committed range is ready for trust validation:

```bash
npm run real:readiness -- --repo .
```

Build the distributable `dist/` output:

```bash
npm run build
```

Run the CLI directly from source:

```bash
node src/cli.js run --repo ./fixtures/simple-js --format json
```

## Expected Repository Layout

The standalone layout is:

- `src/`
- `scripts/`
- `fixtures/`
- `docs/REGRESSPROOF_*.md`
- `regressproof.config.json`
- `regressproof.real-repo.config.json`

The standalone real-repo config assumes verification is executed from the repository root.

## Fixture Workflow

Fixtures use tracked scenario packs:

- `tracked/baseline`
- `tracked/current`
- `fixture.materializer.json`

Preferred flow:

1. materialize a fixture into a temporary git repository
2. run RegressProof against that temporary repo

Example:

```bash
node scripts/materialize-fixture.js \
  --fixture ./fixtures/lint-js \
  --out-dir /tmp/regressproof-materialized-lint

node src/cli.js run \
  --repo /tmp/regressproof-materialized-lint/repo \
  --config /tmp/regressproof-materialized-lint/repo/regressproof.config.json \
  --format json
```

Helpers:

```bash
npm run fixture:materialize -- --fixture ./fixtures/lint-js
npm run fixture:export-pack -- --fixture ./fixtures/lint-js
npm run fixtures:export-all-packs
```

## Real-Repo Trust Flow

The committed trust flow is meant to prove that RegressProof can validate itself or another repository through a real `HEAD~1..HEAD` range instead of only through isolated fixtures.

What the trust flow asserts:

- committed readiness is `ready`
- `diffRange` is `HEAD~1..HEAD`
- baseline mode is `path_snapshot`
- current mode is `snapshot`
- verdict is `successful_change`
- confidence is `high`

The deep trust flow uses a broader nested subset:

- `lint-js`
- `preexisting-js`
- `parser-js`
- `python-js`

## Reports And Artifacts

Each run can emit:

- `regressproof-report.json`
- `regressproof-summary.md`
- `regressproof-pr-summary.md`
- `regressproof-pr-comment.md`
- append-only ledger JSONL

Use `--artifact-dir` to control where they are written.

Example:

```bash
node src/cli.js run \
  --repo /tmp/regressproof-materialized-lint/repo \
  --config /tmp/regressproof-materialized-lint/repo/regressproof.config.json \
  --format json \
  --artifact-dir /tmp/regressproof-artifacts
```

In CI mode, RegressProof exits non-zero only for configured verdict classes:

```bash
node src/cli.js run \
  --repo /tmp/regressproof-materialized-lint/repo \
  --config /tmp/regressproof-materialized-lint/repo/regressproof.config.json \
  --format json \
  --artifact-dir /tmp/regressproof-artifacts \
  --ci
```

## External Repository Example

An example config for validating a lightweight external documentation/plugin repository lives at:

- `examples/external-doc-plugin.config.json`

Example:

```bash
node scripts/run-committed-real-repo-validation.js \
  --repo /tmp/andrej-karpathy-skills \
  --config ./examples/external-doc-plugin.config.json \
  --head-ref HEAD \
  --artifact-dir /tmp/regressproof-external-doc-plugin
```

For public repositories that are too large or ref-heavy for a normal clone, use the sparse public-repo runner:

```bash
node scripts/run-public-repo-validation.js \
  --url https://github.com/openclaw/openclaw.git \
  --config ./examples/external-openclaw-code.config.json \
  --head-ref 97534372f858b5f67a98619a3fed8790edb00cc7 \
  --artifact-dir /tmp/regressproof-openclaw-artifacts
```

That runner resolves the default branch, performs a shallow sparse checkout from the config's `targetPaths`, optionally checks out a pinned `--head-ref`, deepens by one commit for `HEAD~1..HEAD` comparison, then executes the normal committed validation flow.

Curated external validation runs are tracked in:

- `examples/external-runs.json`

Print the current external corpus summary:

```bash
npm run external:runs
```

Validate the external corpus JSON in automation-friendly form:

```bash
npm run external:check
```

## Embedded Workspace Mode

This repository currently lives inside a larger workspace, so there is also a workspace-oriented config:

- `regressproof.workspace-repo.config.json`

That config exists to keep local development inside the larger workspace working.
The default product direction is still standalone-first.

## Canonical Docs

Read these first when resuming work:

1. `docs/REGRESSPROOF_INDEX.md`
2. `docs/REGRESSPROOF_PRODUCT_BRIEF.md`
3. `docs/REGRESSPROOF_SPEC.md`
4. `docs/REGRESSPROOF_IMPLEMENTATION_PLAN.md`
5. `docs/REGRESSPROOF_MVP_TASK_BREAKDOWN.md`
6. `docs/REGRESSPROOF_VALIDATION_PLAN.md`
7. `docs/REGRESSPROOF_DECISION_LOG.md`
