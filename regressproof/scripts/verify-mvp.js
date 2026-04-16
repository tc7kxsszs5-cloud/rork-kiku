#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const regressproofRoot = path.resolve(__dirname, "..");
const workspaceRoot = path.resolve(regressproofRoot, "..");

function main() {
  const args = process.argv.slice(2);
  const repo = readArg(args, "--repo") || workspaceRoot;
  const outDir =
    readArg(args, "--out-dir") || path.join(os.tmpdir(), `regressproof-mvp-${Date.now()}`);

  fs.mkdirSync(outDir, { recursive: true });

  const fixtureSuiteDir = path.join(outDir, "fixtures");
  const trustDir = path.join(outDir, "real-scenario");
  const deepDir = path.join(outDir, "real-scenario-deep");

  const fixtureSuite = runJsonScript(
    path.join(regressproofRoot, "scripts", "run-all-fixtures.js"),
    ["--out-dir", fixtureSuiteDir],
  );
  const trustScenario = runJsonScript(
    path.join(regressproofRoot, "scripts", "verify-real-repo-trust-scenario.js"),
    ["--repo", repo, "--out-dir", trustDir],
  );
  const deepScenario = runJsonScript(
    path.join(regressproofRoot, "scripts", "verify-real-repo-deep-scenario.js"),
    ["--repo", repo, "--out-dir", deepDir],
  );

  const summary = {
    product: "RegressProof",
    mode: "mvp_verification",
    repo,
    outDir,
    fixtureSuite: {
      totalFixtures: fixtureSuite.totalFixtures,
      passedCount: fixtureSuite.passedCount,
      failedCount: fixtureSuite.failedCount,
      summaryPath: path.join(fixtureSuiteDir, "fixture-suite-summary.json"),
    },
    realScenario: trustScenario,
    deepScenario,
    status:
      fixtureSuite.failedCount === 0 &&
      trustScenario.verdict === "successful_change" &&
      deepScenario.verdict === "successful_change"
        ? "passed"
        : "failed",
  };

  const summaryPath = path.join(outDir, "regressproof-mvp-summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  process.stdout.write(`${JSON.stringify({ ...summary, summaryPath }, null, 2)}\n`);
}

function runJsonScript(scriptPath, scriptArgs) {
  const output = execFileSync("node", [scriptPath, ...scriptArgs], {
    cwd: workspaceRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 1024 * 1024 * 20,
  });

  return JSON.parse(output);
}

function readArg(args, name) {
  const index = args.indexOf(name);
  if (index === -1) {
    return "";
  }

  return args[index + 1] || "";
}

main();
