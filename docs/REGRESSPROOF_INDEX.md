# RegressProof Project Index

**Project:** `RegressProof`  
**Purpose:** Persistent project memory and navigation entry point  
**Last updated:** 15 April 2026

## Vision

RegressProof is a validation and accountability layer for AI coding agents.

It is designed to:

- detect measurable agent-caused regressions
- compare baseline vs post-change verification results
- connect failures to patches, commits, and PRs
- track token usage or estimated cost
- maintain an internal credit ledger for confirmed agent-caused faults

Core principle:

`proof, not guesses`

## Current Document Set

- [Product Brief](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_PRODUCT_BRIEF.md)
- [Specification](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_SPEC.md)
- [Implementation Plan](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_IMPLEMENTATION_PLAN.md)
- [MVP Task Breakdown](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_MVP_TASK_BREAKDOWN.md)
- [Validation Plan](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_VALIDATION_PLAN.md)
- [Decision Log](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_DECISION_LOG.md)
- [Workflow Memory](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_WORKFLOW_MEMORY.md)
- [Session Template](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_SESSION_TEMPLATE.md)
- [Session Notes Directory](/Users/mac/Desktop/rork-kiku/docs/sessions/README.md)

## Current Implementation Status

Implementation has started.

Current code scaffold lives in:

- [regressproof/README.md](/Users/mac/Desktop/rork-kiku/regressproof/README.md)
- [regressproof/package.json](/Users/mac/Desktop/rork-kiku/regressproof/package.json)
- [regressproof/regressproof.config.json](/Users/mac/Desktop/rork-kiku/regressproof/regressproof.config.json)
- [regressproof/src/cli.js](/Users/mac/Desktop/rork-kiku/regressproof/src/cli.js)

What already works:

- local CLI entrypoint
- config loading
- git context collection
- structured report generation
- build script that prepares `dist/`
- baseline snapshot execution
- current quick-check execution
- first conservative verdicts
- fixture scenario packs for introduced and preexisting failures
- explicit `preexistingFailures`, `introducedFailures`, `unchangedFailures`, and `fixedFailures`
- fingerprint-based failure comparison, so one failing command can still be split into preexisting and newly introduced failures
- timeout-aware environment classification
- structured failure parsing with:
  - `checkType`
  - `filePath`
  - `evidence`
  - `touchesChangedFile`
  - `changedFileMatchKind`
  - `matchedChangedFiles`
- JSON and Markdown artifact generation for CI workflows
- initial GitHub Action skeleton at `.github/workflows/regressproof.yml`
- CI exit policy based on configurable verdict classes
- GitHub Step Summary support for Actions
- GitHub output variables:
  - `verdict`
  - `confidence`
  - `changed_file_match`
  - `ci_should_fail`
  - artifact paths
- usage/cost scaffold with `estimated` and `exact` modes
- exact usage mode now supports environment-driven activation without config edits
- lightweight real-repo validation config:
  - [regressproof.real-repo.config.json](/Users/mac/Desktop/rork-kiku/regressproof/regressproof.real-repo.config.json)
- lightweight large-repo mode with:
  - `baseline.mode = skip`
  - `targetPaths`
- `path_snapshot` mode with graceful fallback to `skip` when target paths are not yet present in baseline history
- internal credit ledger scaffold
- persistent JSONL ledger storage under the artifact directory
- PR comment body artifact generation
- direct PR comment publishing via GitHub Actions
- validated fixture scenarios now include:
  - introduced failure
  - introduced lint regression
  - preexisting failure
  - preexisting failure plus a newly introduced failure
  - build regression in changed code
  - test regression in changed code
  - timeout / environment failure
  - Python typecheck regression
  - parser-targeted multi-line typecheck regression
  - Swift typecheck regression with local module-cache isolation
- self-hosted real-workspace trust validation now runs successfully in lightweight mode
- subproject packaging boundary now includes:
  - [regressproof/AGENTS.md](/Users/mac/Desktop/rork-kiku/regressproof/AGENTS.md)
  - [regressproof/.gitignore](/Users/mac/Desktop/rork-kiku/regressproof/.gitignore)
  - `npm run export:standalone` for near-standalone repository export
- committed attribution now supports:
  - explicit `baselineRef..compareRef` ranges
  - snapshot execution of the compared committed ref
  - richer git context in reports for commit-vs-commit reasoning
  - readiness checking before running committed validation on the main repository
- fixture validation now runs through tracked scenario packs:
  - `tracked/baseline`
  - `tracked/current`
  - `fixture.materializer.json`
  - temporary git materialization before verification
- all current fixtures now have tracked scenario packs, and the full suite passes in tracked-pack mode

What is next:

- path-scoped baseline snapshots for targeted real-repo validation
- provider-native usage adapters beyond env/file ingestion
- deeper real-repository validation beyond fixture coverage
- richer PR presentation and review thread behavior
- cleaner standalone packaging and eventual repo separation

## Current Product Positioning

RegressProof is **not** framed as a universal provider token refund tool.

RegressProof **is** framed as:

- agent regression detection
- fault attribution with evidence
- cost accountability
- internal credit and reliability tracking

## MVP Scope

The first version should include:

- local CLI
- GitHub Action
- baseline engine
- verification engine
- diff mapping
- fault classifier
- internal cost and credit ledger
- markdown and JSON reports
- PR comment publishing

The first version should exclude:

- full provider-native integrations
- dashboards as a hard requirement
- low-confidence auto-credit decisions
- claims of universal provider refunds

## Canonical Success Criteria

The first release is successful if it can:

- run on a real repository
- detect a known bad patch
- avoid blaming the agent for pre-existing failures
- assign a confidence-scored verdict
- record cost or estimated cost
- produce a report that a human reviewer trusts
- append persistent ledger evidence for repeated runs

## Recommended Working Order

1. Finalize scope and assumptions in the documents already created.
2. Build proof-of-function on a small fixture scenario pack.
3. Implement local CLI MVP.
4. Add GitHub Action integration.
5. Add internal credit ledger.
6. Validate against controlled bad and good patches.

## Working Principles

- Do not rely on intuition-only classification.
- Trust only measurable signals.
- Keep confidence scoring conservative.
- Separate `confirmed` from `possible`.
- Ignore pre-existing failures unless worsened.
- Avoid product claims the system cannot prove.

## Immediate Next Steps

- deepen path-scoped baseline support for larger real repositories
- add provider-native usage adapters beyond env/file inputs
- improve PR comment presentation for longer review threads
- validate on a deeper real-repository scenario now that JS, Python, parser-targeted, and Swift fixtures exist
- keep tightening the `regressproof/` package boundary so future repo separation is mechanical instead of manual
- use the new committed compare-ref path to validate RegressProof on a meaningful historical range inside the main repository
- keep fixture packs self-contained and reproducible through the materialization layer
- remove remaining legacy wording that treats embedded fixture repos as the working model
- deepen release/demo guidance around the full tracked-pack suite

## Current Real-Repo Validation Level

Current real-repository validation is best described as:

- `self-hosted real-workspace trust validation`

This means RegressProof can now run inside the real workspace and execute a nested RegressProof trust check successfully against a small but meaningful fixture subset.

It does **not** yet mean:

- deep diff-aware attribution on committed RegressProof changes in the main repository
- rich real-repo baseline comparison with non-empty changed-file evidence

However, the core engine now supports the mechanics needed for that next step:

- explicit commit-vs-commit diff ranges
- snapshot execution for the compared committed ref
- reports that expose baseline commit, compare commit, and execution mode
- graceful fallback when committed refs do not yet contain the RegressProof project boundary

## Memory Rule

If future work resumes in a new session, start by reading these files in order:

1. [Product Brief](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_PRODUCT_BRIEF.md)
2. [Specification](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_SPEC.md)
3. [Implementation Plan](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_IMPLEMENTATION_PLAN.md)
4. [MVP Task Breakdown](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_MVP_TASK_BREAKDOWN.md)
5. [Decision Log](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_DECISION_LOG.md)
6. [Workflow Memory](/Users/mac/Desktop/rork-kiku/docs/REGRESSPROOF_WORKFLOW_MEMORY.md)
7. the latest session note in [docs/sessions](/Users/mac/Desktop/rork-kiku/docs/sessions/README.md)

This file should remain the top-level project memory entry point.
