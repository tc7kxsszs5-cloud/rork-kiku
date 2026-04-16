# RegressProof Prototype Walkthrough

**Date:** 15 April 2026  
**Status:** Prototype-ready overview

## What Exists Today

The current `RegressProof` prototype can:

- read a repo-specific config
- resolve a baseline ref
- create a baseline snapshot from git history
- run quick checks on baseline and current code
- compare failure states
- split and normalize failure evidence into structured records
- classify:
  - `confirmed_agent_fault`
  - `preexisting_failure`
  - `environment_failure`
  - `successful_change`
  - `insufficient_evidence`
- write JSON and Markdown artifacts
- expose GitHub-compatible outputs
- generate a PR-oriented compact markdown summary
- track estimated or exact usage cost in reports
- run self-hosted lightweight trust validation inside a real repository workspace
- generate a PR comment body artifact
- compute a first internal credit recommendation
- append persistent JSONL ledger entries
- publish or update a marker-based PR comment in GitHub Actions
- render more review-friendly summaries with clearer verdict headlines and failure counts

## Demonstrated Scenarios

The prototype includes validated fixture scenario packs for multiple regression classes:

- `regressproof/fixtures/simple-js`
  - demonstrates a newly introduced failure
- `regressproof/fixtures/lint-js`
  - demonstrates a newly introduced lint regression
- `regressproof/fixtures/preexisting-js`
  - demonstrates a failure that already existed before the current change
- `regressproof/fixtures/mixed-js`
  - demonstrates a pre-existing failure plus a newly introduced failure in changed code
- `regressproof/fixtures/build-js`
  - demonstrates a build regression in changed code
- `regressproof/fixtures/test-js`
  - demonstrates a test regression in changed code
- `regressproof/fixtures/timeout-js`
  - demonstrates an environment-style timeout case
- `regressproof/fixtures/parser-js`
  - demonstrates a realistic multi-line typecheck failure and parser-oriented evidence grouping
- `regressproof/fixtures/python-js`
  - demonstrates a Python typecheck-style regression
- `regressproof/fixtures/swift-js`
  - demonstrates a Swift typecheck-style regression using a local module-cache path to avoid sandbox-only cache failures

Current fixture execution model:

- tracked `baseline/current` scenario packs are the new primary fixture shape
- the materializer reconstructs temporary git history from those packs
- the full fixture suite now runs end-to-end through that tracked-pack path

## Why This Matters

This proves the product is no longer a concept only.

It can already:

- distinguish some new failures from old ones
- avoid blaming every red check on the current change
- preserve more coherent multi-line failure evidence in structured records
- produce machine-readable outputs for CI
- generate human-readable summaries for review workflows
- support CI failure policy based on verdict class
- run in a practical lightweight mode on a large repository
- run a self-hosted real-workspace trust check as an early integration proof
- expose a first credit-accountability model in reports
- validate regression scenarios beyond one language/runtime

## Current Limits

The prototype does not yet:

- parse every framework-specific failure format
- map failures at symbol-level depth
- ingest provider token usage from native platform adapters
- compute internal credits beyond the current policy-driven model
- handle large monorepos with an optimized lightweight baseline strategy
- perform path-scoped baseline snapshots for real-repo deep validation
- run deeper real-repo validation beyond the current smoke-check mode

## Current Real-Repo Validation Level

Today, the real-repo path proves:

- RegressProof can run from within the real workspace
- RegressProof can execute a committed-boundary trust check successfully in that workspace

Today, it does not yet prove:

- deep committed-change attribution for real RegressProof edits in the main repository
- rich changed-file evidence in the current real-repo run path

## What The Next Stage Should Deliver

- CI outputs integrated into workflow decisions
- PR-oriented summary usage
- provider adapters for exact usage ingestion
- deeper path-scoped real-repo validation
- additional language/runtime validation beyond the current fixture families as needed

## Quick Demo Command

```bash
cd regressproof
node scripts/run-all-fixtures.js --out-dir /tmp/regressproof-fixture-suite
```
