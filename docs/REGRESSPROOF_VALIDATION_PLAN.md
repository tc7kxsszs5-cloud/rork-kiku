# RegressProof Validation Plan

**Date:** 13 April 2026  
**Status:** Active MVP validation

## Goal

Prove that RegressProof detects real regressions using evidence and does not invent conclusions.

## Validation Principles

- test against controlled fixture scenario packs that materialize into temporary git repos
- compare baseline and post-change states
- measure false positives and false negatives
- separate code regressions from environment failures
- require reproducible evidence for confirmed faults

## Validation Targets

The system should prove that it can:

- detect new build failures
- detect new typecheck failures
- detect new lint failures
- detect new test regressions
- ignore pre-existing failures
- avoid false blame during environment issues

## Fixture Scenario Set

### Current JS Fixtures

Validated today:

- `simple-js`
  - green baseline to broken typecheck
- `preexisting-js`
  - pre-existing failure with no new regression
- `mixed-js`
  - pre-existing failure plus one newly introduced failure
- `build-js`
  - green baseline to broken build
- `lint-js`
  - green baseline to broken lint
- `test-js`
  - green baseline to broken test
- `timeout-js`
  - timeout / environment-style failure
- `parser-js`
  - green baseline to realistic multi-line typecheck stderr

### Current Non-JS Fixtures

Validated today:

- `python-js`
  - green baseline to broken Python typecheck-style check
- `swift-js`
  - green baseline to broken Swift typecheck-style check
  - uses a local Swift module cache path so the scenario reflects product behavior instead of sandbox cache-write failures
- `swiftpm-macos`
  - green baseline to broken SwiftPM macOS build
  - compiles real AppKit code through `swift build`
  - failure attribution comes from actual Swift compiler output in the changed source file

Current fixture architecture:

- each fixture now has a tracked scenario-pack path
- primary layout:
  - `tracked/baseline`
  - `tracked/current`
  - `fixture.materializer.json`
- the materializer reconstructs a temporary git repo before verification
- the full suite now runs reproducibly through tracked packs as the primary validation path

### Future Fixture Sets

- Python service fixture
  - richer test regressions
  - API contract failures
  - environment handling
- small iOS or macOS app sample beyond SwiftPM
  - app bundle build failures
  - UI-targeted test failures
  - Xcode build-system parsing beyond package-level checks

## Controlled Scenarios

### Scenario A: Green baseline to broken build

Expected:

- `confirmed_agent_fault`
- high confidence

### Scenario B: Green baseline to broken typecheck

Expected:

- `confirmed_agent_fault`
- high confidence

### Scenario B2: Green baseline to broken lint

Expected:

- `confirmed_agent_fault`
- high confidence

### Scenario C: Green baseline to failing unit test in changed file

Expected:

- `confirmed_agent_fault`
- high confidence

### Scenario D: One pre-existing failing test plus one new failure

Expected:

- pre-existing failure preserved
- new failure attributed separately

### Scenario E: CI timeout or external service failure

Expected:

- `environment_failure` or `insufficient_evidence`

### Scenario F: Good patch

Expected:

- `successful_change`
- no false credit event

### Scenario G: Multi-line structured stderr from one underlying failure

Expected:

- one underlying failure should remain attributable as a coherent record
- file extraction should still point to the changed source file

### Scenario H: Non-JS regression in Python or Swift fixture

Expected:

- `confirmed_agent_fault`
- high confidence
- changed-file match preserved when the failure points to the modified source file

## Metrics

- regression detection rate
- false positive rate
- false negative rate
- classification reproducibility
- percentage of runs with sufficient evidence

## Initial Quality Targets

- high-confidence regression detection: `85%+` on controlled fixture scenarios
- false positive rate: `<10%` on controlled fixture scenarios
- classification reproducibility: `95%+` on repeated controlled runs

## Human Review Layer

Before trusting the first release broadly:

- review at least 20 classified runs manually
- compare system verdict to human engineering judgment
- tune confidence thresholds only after review

## Current Real-Repo Trust Layer

- the current real-repo validation path now runs a small trusted fixture subset from within the main workspace
- this checks both introduced-failure handling and preexisting-failure handling through the tracked-pack materialization path
- it is still lighter than full deep real-repo attribution, but materially stronger than a file-existence self-check
- the committed trust flow now supports both:
  - standalone repository layout
  - embedded workspace layout through workspace-aware config resolution
- a temporary standalone-style git repo assembled from the current RegressProof files now passes both:
  - committed trust scenario
  - committed deep trust scenario

## External Public Repository Runs

External run metadata is curated in `regressproof/examples/external-runs.json`.

- `openclaw/openclaw`
  - date: 21 April 2026
  - compared range: `dc6ecd5..9753437`
  - scope: latest `main` commit touching OpenAI Codex provider code and provider tests
  - changed files observed by RegressProof:
    - `CHANGELOG.md`
    - `extensions/openai/openai-codex-provider.ts`
    - `extensions/openai/openai-codex-provider.test.ts`
  - result: `successful_change / high`
  - note: initial full clone attempts were too heavy because the repository has many refs; the successful run used a sparse shallow checkout and lightweight path-snapshot checks without installing dependencies
  - artifact: `/tmp/regressproof-openclaw-artifacts/regressproof-report.json`
- reusable public-repo runner verification
  - command surface: `node regressproof/scripts/run-public-repo-validation.js`
  - repository: `openclaw/openclaw`
  - date: 21 April 2026
  - result: `successful_change / high`
  - note: this later run followed current `main`, which had advanced to a changelog-only latest commit; it validates the sparse clone/deepen/snapshot workflow rather than the earlier provider-code diff
  - artifact: `/tmp/regressproof-openclaw-runner-artifacts/regressproof-report.json`
- reproducible public-repo runs should pin `--head-ref` to a commit SHA when preserving a specific validation example
  - example pinned OpenClaw provider-code head: `97534372f858b5f67a98619a3fed8790edb00cc7`
  - pinned rerun artifact: `/tmp/regressproof-openclaw-pinned-artifacts/regressproof-report.json`
  - pinned rerun result: `successful_change / high`

### Proposed External Corpus Queue

The next curated public-repository candidates after OpenClaw should stay small enough for sparse/shallow validation and should be treated as candidates until a pinned run is recorded. Selection should favor repositories with clear TS/Python verification commands, compact changed-file scopes, and enough tests or type/lint checks to exercise baseline-vs-current evidence without a heavyweight dependency install.

1. `sindresorhus/ky`
   - language/scope: TypeScript HTTP client library
   - candidate value: compact source and test surface with type-aware changes likely to produce clear diff-to-check evidence
   - proposed first pass: sparse shallow checkout, inspect recent source/test commits, then pin a small code commit before running lightweight path snapshots
2. `unjs/ofetch`
   - language/scope: TypeScript fetch utility
   - candidate value: small library surface with source and test files that should fit the public-repo runner model
   - proposed first pass: target a recent non-doc source/test commit and avoid full dependency-heavy validation until setup cost is known
3. `nanostores/nanostores`
   - language/scope: TypeScript state-management library
   - candidate value: focused package with tests and type-oriented behavior changes, useful for regression classification beyond provider-code examples
   - proposed first pass: pin a compact source/test diff and capture changed files before attempting install-backed checks
4. `pallets/click`
   - language/scope: Python CLI framework
   - candidate value: mature Python repository with testable CLI behavior, broadens the corpus beyond TypeScript
   - proposed first pass: select a small Python source/test commit and start with metadata plus path-snapshot evidence before any pytest run
5. `pytest-dev/pluggy`
   - language/scope: Python plugin system
   - candidate value: smaller Python core library with tests, suitable for exercising Python attribution without a large application stack
   - proposed first pass: pin a recent code commit with changed tests or source, then decide whether lightweight local checks are feasible

Candidate acceptance criteria:

- record only pinned commit ranges as completed validation runs
- label floating `HEAD` checks as runner smoke, not corpus proof
- keep dependency installation optional until repository setup time and network cost are understood
- classify uncertain failures as `environment_failure` or `insufficient_evidence`, not confirmed faults

## Validation Exit Rule

RegressProof is validated for MVP when:

- it passes controlled fixture scenarios
- it avoids blaming the agent for pre-existing failures
- it avoids misclassifying environment failures as agent faults
- its reports are judged trustworthy by human reviewers
- it demonstrates credible validation coverage beyond one language/runtime
- the full fixture suite runs reproducibly through the materialization layer
