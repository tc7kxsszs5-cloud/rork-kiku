#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const repoRoot = process.cwd();
const regressproofRoot = path.join(repoRoot, "regressproof");

const EXPECTED_VERDICTS = new Map([
  ["lint-js", "confirmed_agent_fault"],
  ["preexisting-js", "preexisting_failure"],
]);
const EXPECTED_MATERIALIZATION = "tracked_scenario_pack";

function main() {
  ensureRequiredFiles();

  const outDir = path.join(os.tmpdir(), `regressproof-trust-check-${Date.now()}`);
  const runnerPath = path.join(regressproofRoot, "scripts", "run-all-fixtures.js");
  const args = [
    runnerPath,
    "--fixture",
    "lint-js",
    "--fixture",
    "preexisting-js",
    "--out-dir",
    outDir,
  ];

  execFileSync("node", args, {
    cwd: repoRoot,
    stdio: ["ignore", "ignore", "pipe"],
    maxBuffer: 1024 * 1024 * 10,
  });

  const summaryPath = path.join(outDir, "fixture-suite-summary.json");
  const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));

  if (summary.failedCount !== 0) {
    throw new Error("Trust check fixture subset must complete without failed runs.");
  }

  for (const [fixture, expectedVerdict] of EXPECTED_VERDICTS.entries()) {
    const result = summary.fixtures.find((entry) => entry.fixture === fixture);
    if (!result) {
      throw new Error(`Missing trust-check result for fixture: ${fixture}`);
    }
    if (result.materialization !== EXPECTED_MATERIALIZATION) {
      throw new Error(
        `Unexpected materialization for ${fixture}: expected ${EXPECTED_MATERIALIZATION}, received ${result.materialization}`,
      );
    }
    if (result.verdict !== expectedVerdict) {
      throw new Error(
        `Unexpected verdict for ${fixture}: expected ${expectedVerdict}, received ${result.verdict}`,
      );
    }
  }

  process.stdout.write("RegressProof real-repo trust-check passed\n");
}

function ensureRequiredFiles() {
  const required = [
    "regressproof/package.json",
    "regressproof/scripts/run-all-fixtures.js",
    "regressproof/scripts/materialize-fixture.js",
    "regressproof/fixtures/lint-js/fixture.materializer.json",
    "regressproof/fixtures/preexisting-js/fixture.materializer.json",
  ];

  for (const relativePath of required) {
    if (!fs.existsSync(path.join(repoRoot, relativePath))) {
      throw new Error(`Missing required trust-check file: ${relativePath}`);
    }
  }
}

main();
