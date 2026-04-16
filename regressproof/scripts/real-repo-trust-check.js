#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const repoRoot = process.cwd();
const regressproofRoot = path.join(repoRoot, "regressproof");
const DEFAULT_PROFILE = "shallow";
const EXPECTED_MATERIALIZATION = "tracked_scenario_pack";

const PROFILES = {
  shallow: new Map([
    ["lint-js", "confirmed_agent_fault"],
    ["preexisting-js", "preexisting_failure"],
  ]),
  deep: new Map([
    ["lint-js", "confirmed_agent_fault"],
    ["preexisting-js", "preexisting_failure"],
    ["parser-js", "confirmed_agent_fault"],
    ["python-js", "confirmed_agent_fault"],
  ]),
};

function main() {
  const args = process.argv.slice(2);
  const profile = readArg(args, "--profile") || DEFAULT_PROFILE;
  const expectedFixtures = PROFILES[profile];
  if (!expectedFixtures) {
    throw new Error(`Unknown trust-check profile: ${profile}`);
  }

  ensureRequiredFiles(expectedFixtures);

  const outDir = path.join(os.tmpdir(), `regressproof-trust-check-${Date.now()}`);
  const runnerPath = path.join(regressproofRoot, "scripts", "run-all-fixtures.js");
  const runnerArgs = [
    runnerPath,
    "--out-dir",
    outDir,
  ];
  for (const fixture of expectedFixtures.keys()) {
    runnerArgs.push("--fixture", fixture);
  }

  execFileSync("node", runnerArgs, {
    cwd: repoRoot,
    stdio: ["ignore", "ignore", "pipe"],
    maxBuffer: 1024 * 1024 * 10,
  });

  const summaryPath = path.join(outDir, "fixture-suite-summary.json");
  const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));

  if (summary.failedCount !== 0) {
    throw new Error("Trust check fixture subset must complete without failed runs.");
  }

  for (const [fixture, expectedVerdict] of expectedFixtures.entries()) {
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

  process.stdout.write(`RegressProof real-repo trust-check passed [profile=${profile}]\n`);
}

function ensureRequiredFiles(expectedFixtures) {
  const required = [
    "regressproof/package.json",
    "regressproof/scripts/run-all-fixtures.js",
    "regressproof/scripts/materialize-fixture.js",
  ];
  for (const fixture of expectedFixtures.keys()) {
    required.push(`regressproof/fixtures/${fixture}/fixture.materializer.json`);
  }

  for (const relativePath of required) {
    if (!fs.existsSync(path.join(repoRoot, relativePath))) {
      throw new Error(`Missing required trust-check file: ${relativePath}`);
    }
  }
}

function readArg(args, name) {
  const index = args.indexOf(name);
  if (index === -1) {
    return "";
  }

  return args[index + 1] || "";
}

main();
