#!/usr/bin/env node

const path = require("node:path");

const workspaceRoot = path.resolve(__dirname, "..", "..");

const scope = [
  ".github/workflows/regressproof.yml",
  "AGENTS.md",
  "docs/REGRESSPROOF_DECISION_LOG.md",
  "docs/REGRESSPROOF_INDEX.md",
  "docs/REGRESSPROOF_PROTOTYPE_WALKTHROUGH.md",
  "docs/REGRESSPROOF_SESSION_TEMPLATE.md",
  "docs/REGRESSPROOF_VALIDATION_PLAN.md",
  "docs/REGRESSPROOF_WORKFLOW_MEMORY.md",
  "docs/sessions/README.md",
  "docs/sessions/2026-04-14-session.md",
  "docs/sessions/2026-04-15-session.md",
  "regressproof",
  "scripts/regressproof-session.js",
];

const excluded = [
  "regressproof/artifacts/",
  "regressproof/dist/",
  "regressproof/fixtures/*/.git/ if legacy import metadata is still present locally",
  "regressproof/fixtures/*/.swift-module-cache/",
  "docs/sessions/* if you do not want session history in the first bootstrap commit",
];

const lines = [
  "RegressProof Bootstrap Commit Scope",
  `Workspace: ${workspaceRoot}`,
  "",
  "Recommended paths to include:",
  ...scope.map((entry) => `- ${entry}`),
  "",
  "Recommended exclusions:",
  ...excluded.map((entry) => `- ${entry}`),
  "",
  "Suggested staging command:",
  `git add ${scope.join(" ")}`,
];

process.stdout.write(`${lines.join("\n")}\n`);
