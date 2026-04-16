# RegressProof Workflow Memory

This file exists to help future sessions quickly recover the intended workflow for this project.

## Fast Resume Checklist

When continuing work on `RegressProof`:

1. Read `AGENTS.md`
2. Read `docs/REGRESSPROOF_INDEX.md`
3. Read `docs/REGRESSPROOF_DECISION_LOG.md`
4. Decide whether the task is:
   - product clarification
   - architecture refinement
   - implementation planning
   - actual code implementation
   - validation or testing
5. If implementation starts, align the work to `docs/REGRESSPROOF_MVP_TASK_BREAKDOWN.md`

## Core Product Boundaries

RegressProof should:

- prove regressions using measurable evidence
- avoid speculative blame
- work first through GitHub and repository workflows
- treat documentation as persistent project memory

RegressProof should not:

- promise provider-side token refunds by default
- auto-credit low-confidence failures
- present ambiguous failures as confirmed agent faults

## Best Next Moves

The best execution order for the project is:

1. maintain docs
2. keep the tracked fixture-pack suite reproducible through the materialization layer
3. implement local CLI
4. integrate with GitHub Action
5. add cost and credit accounting
6. validate on external public repositories, not only self-hosted RegressProof flows

## Current Proven Validation Surface

RegressProof is no longer validated only against internal fixtures and self-hosted trust scenarios.

It has now been exercised successfully on external public repositories in three modes:

1. doc/plugin repository:
   - `forrestchang/andrej-karpathy-skills`
   - committed range `HEAD~1..HEAD`
   - result: `successful_change / high`
2. larger documentation and configuration repository:
   - `shanraisshan/claude-code-best-practice`
   - committed range `HEAD~1..HEAD`
   - changed file: `tutorial/day1/README.md`
   - result: `successful_change / high`
   - notable signal: current run resolved baseline-side structural/content failures for the new tutorial path
3. code and test repository:
   - `NousResearch/hermes-agent`
   - committed range `HEAD~1..HEAD`
   - changed files:
     - `gateway/platforms/telegram.py`
     - `tests/gateway/test_telegram_thread_fallback.py`
   - result: `successful_change / high`

This means the project now has evidence across:

- tracked internal fixtures
- self-hosted real-repo trust scenarios
- external doc/plugin repositories
- external documentation/configuration repositories
- external code-plus-test repositories

## If A Future Agent Is Unsure

If a future agent is unsure what to do next, it should:

- consult `docs/REGRESSPROOF_INDEX.md`
- use `docs/REGRESSPROOF_MVP_TASK_BREAKDOWN.md` as the execution plan
- record new major decisions in `docs/REGRESSPROOF_DECISION_LOG.md`
- check the latest note in `docs/sessions/`
- prefer extending external validation coverage before adding new architecture layers

## Session Memory Rule

To preserve context across sessions:

- store one short session note per meaningful work session in `docs/sessions/`
- use `docs/REGRESSPROOF_SESSION_TEMPLATE.md` as the default format
- record durable architectural or product decisions in `docs/REGRESSPROOF_DECISION_LOG.md`
- keep this file focused on restart workflow, not long historical logs
