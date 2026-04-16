# RegressProof Decision Log

**Date created:** 13 April 2026  
**Purpose:** Preserve major project decisions across future sessions

## Decision 1

**Decision:** The project name is `RegressProof`.

**Reason:** The name reflects the core product promise: proving regressions with evidence rather than guessing.

## Decision 2

**Decision:** The product is positioned as a regression detection and accountability layer, not a guaranteed provider token refund mechanism.

**Reason:** Provider-side refunds cannot be promised universally. Internal credits and cost accountability are technically feasible and honest.

## Decision 3

**Decision:** The first implementation should be GitHub-first.

**Reason:** GitHub gives the most practical shared layer for diffs, PRs, CI, and repository-based verification across many agent workflows.

## Decision 4

**Decision:** Fault attribution must rely on measurable evidence only.

**Reason:** The system must not invent conclusions. It must use baseline comparison, checks, and diff-aware classification.

## Decision 5

**Decision:** The MVP should only auto-credit high-confidence confirmed agent faults.

**Reason:** Conservative decisions protect trust and reduce false positives.

## Decision 6

**Decision:** The initial implementation should prioritize local CLI plus GitHub Action.

**Reason:** This gives the fastest proof-of-function and the broadest early applicability.

## Decision 7

**Decision:** Documentation is the canonical project memory between sessions.

**Reason:** Assistant memory alone is not reliable enough for long-term project continuity. Markdown docs in the repo are the source of truth.

## Decision 8

**Decision:** The first executable RegressProof scaffold is implemented as a plain Node.js CLI runtime inside `regressproof/`, while TypeScript scaffolding remains available for later hardening.

**Reason:** This gives a reliable, runnable MVP foundation immediately and avoids blocking on toolchain issues before baseline and verification logic exist.

## Decision 9

**Decision:** Baseline comparison uses `git archive` snapshots instead of `git worktree` for the first implementation.

**Reason:** Snapshot-based baseline execution is more robust in the current environment and avoids repository write constraints around worktree management.

## Decision 10

**Decision:** The MVP report must explicitly separate `preexistingFailures`, `introducedFailures`, `unchangedFailures`, and `fixedFailures`.

**Reason:** This is necessary to justify future fault attribution and to prove whether a problem existed before the current agent change.

## Decision 11

**Decision:** Failure records in MVP must be structured, not just stored as raw stderr/stdout.

**Reason:** GitHub summaries, CI artifacts, and later fault attribution need normalized fields such as `checkType`, `filePath`, `evidence`, and `touchesChangedFile`.

## Decision 12

**Decision:** CI should fail only on explicitly configured verdict classes, with `confirmed_agent_fault` as the default fail condition.

**Reason:** Preexisting failures and environment issues should be visible in reports without automatically blocking pipelines in the MVP.

## Decision 13

**Decision:** Usage and cost tracking start in MVP as a scaffold with `estimated` mode first, while `exact` mode remains reserved for future provider integrations.

**Reason:** Cost accountability is part of the product promise, but provider-native usage ingestion should not block early regression proof-of-function.

## Decision 14

**Decision:** Large repositories will need a lighter baseline strategy than full snapshot validation for routine runs.

**Reason:** Full baseline snapshots are acceptable for fixtures and small repositories, but heavy repos need path-scoped or lighter validation to stay fast and practical.

## Decision 15

**Decision:** The first real-repository validation path uses `baseline.mode = skip` plus targeted paths for smoke checks.

**Reason:** This gives a practical bridge from fixture-based validation to large repositories without blocking on full path-scoped baseline implementation.

## Decision 16

**Decision:** `path_snapshot` should degrade gracefully to `skip` when requested target paths are not available in the baseline commit.

**Reason:** This is common when RegressProof is added to an existing repository and its files do not yet exist in earlier commits.

## Decision 17

**Decision:** Internal credits are represented in MVP as an explicit report ledger field, triggered by policy rather than external billing integration.

**Reason:** This preserves the accountability model now without blocking on provider-specific refund mechanisms.

## Decision 18

**Decision:** MVP exact usage ingestion should support environment-based activation and env/file sourcing before provider-specific adapters exist.

**Reason:** This gives CI and external agent runners a practical way to inject real usage metadata now without hard-coding provider logic into the core verifier.

## Decision 19

**Decision:** MVP ledger persistence uses append-only JSONL under the artifact directory rather than a database.

**Reason:** JSONL keeps the first storage layer transparent, cheap, portable, and easy to inspect in local runs and CI artifacts.

## Decision 20

**Decision:** GitHub PR integration should update or create one marker-based issue comment instead of posting a new comment on every run.

**Reason:** A single rolling RegressProof comment keeps PR threads readable and makes repeated CI updates practical.

## Decision 21

**Decision:** Swift-based fixtures in MVP should use a local module-cache path inside the fixture repository.

**Reason:** In the current environment, the default Swift module cache path can fail due to sandboxed cache-write restrictions. Using a local writable cache path keeps Swift fixtures focused on regression detection rather than environment noise.

## Decision 22

**Decision:** RegressProof packaging should treat `regressproof/` as the standalone project boundary and support file-based export into a near-standalone repository shape.

**Reason:** The main workspace contains substantial unrelated product code. A clear subproject boundary plus deterministic export keeps MVP development focused now and makes future repo separation low-risk.

## Decision 23

**Decision:** Committed real-repo attribution should support explicit `baselineRef..compareRef` ranges and run the compared ref from a snapshot instead of assuming the live checkout represents the current side of the comparison.

**Reason:** Real repository debugging often needs to inspect historical commit ranges that are not identical to the current checkout state. Snapshot-based current execution keeps commit-vs-commit attribution reproducible and diff-aware.

## Decision 24

**Decision:** Tracked fixture scenario packs are now the primary validation model, and fixture materialization into temporary git repos is the standard execution path for controlled validation.

**Reason:** Tracked packs keep fixture state versionable inside the main repository while preserving baseline/current semantics. Materialization retains git-aware validation behavior without making embedded fixture repositories part of the long-term working model.

## Decision 25

**Decision:** Default committed real-repo attribution should prefer the nearest parent range (`HEAD~1..HEAD`) before falling back to a wider merge-base range.

**Reason:** For RegressProof, trust grows faster when committed validation stays close to the actual change under review. Preferring the nearest parent keeps changed-file evidence narrower, makes readiness more meaningful, and avoids unnecessary baseline skips caused by selecting ranges that predate the RegressProof project boundary.

## Decision 26

**Decision:** The usable MVP verification surface should be anchored on one repository-level entrypoint, `node regressproof/scripts/verify-mvp.js`, and the GitHub Action should execute that flow instead of an older single-fixture path.

**Reason:** The project had already accumulated strong pieces of validation, but usability was still fragmented across many helper commands and a stale workflow. A single MVP verification entrypoint makes local checks, CI, and future handoff much clearer without changing the core proof model.

## Decision 27

**Decision:** External validation should expand across repository categories before adding another major architecture layer.

**Reason:** RegressProof now has a usable MVP, internal fixtures, self-hosted real-repo trust scenarios, and an MVP verification entrypoint. The highest-value next evidence comes from more external repository runs across doc/plugin, docs/configuration, and code-plus-test repositories, not from adding more internal machinery first.
