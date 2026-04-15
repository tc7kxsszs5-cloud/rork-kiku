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
  const compareRef = readArg(args, "--head-ref") || "HEAD";
  const outDir =
    readArg(args, "--out-dir") || path.join(os.tmpdir(), `regressproof-real-scenario-${Date.now()}`);

  fs.mkdirSync(outDir, { recursive: true });

  const readiness = runReadiness(repo, compareRef);
  assertReadiness(readiness);

  const reportPath = path.join(outDir, "regressproof-report.json");
  execFileSync(
    "node",
    [
      path.join(regressproofRoot, "scripts", "run-committed-real-repo-validation.js"),
      "--repo",
      repo,
      "--head-ref",
      compareRef,
      "--artifact-dir",
      outDir,
    ],
    {
      cwd: workspaceRoot,
      stdio: ["ignore", "ignore", "pipe"],
      maxBuffer: 1024 * 1024 * 20,
    },
  );

  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  assertCommittedScenario(report);

  process.stdout.write(
    `${JSON.stringify(
      {
        product: "RegressProof",
        mode: "real_repo_trust_scenario",
        repo,
        diffRange: report.git.diffRange,
        readiness: readiness.readiness,
        baselineMode: report.verification.baselineMode,
        currentMode: report.verification.currentMode,
        verdict: report.verdict.classification,
        confidence: report.verdict.confidence,
        reportPath,
      },
      null,
      2,
    )}\n`,
  );
}

function runReadiness(repo, compareRef) {
  const output = execFileSync(
    "node",
    [
      path.join(regressproofRoot, "scripts", "check-committed-range-readiness.js"),
      "--repo",
      repo,
      "--head-ref",
      compareRef,
      "--format",
      "json",
    ],
    {
      cwd: workspaceRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 1024 * 1024 * 10,
    },
  );

  return JSON.parse(output);
}

function assertReadiness(readiness) {
  if (readiness.readiness !== "ready") {
    throw new Error(`Expected committed readiness to be ready, received ${readiness.readiness}`);
  }

  if (readiness.baselineRef !== "HEAD~1") {
    throw new Error(`Expected readiness baselineRef to be HEAD~1, received ${readiness.baselineRef}`);
  }

  if (!Array.isArray(readiness.changedFiles) || readiness.changedFiles.length === 0) {
    throw new Error("Expected readiness report to include changed files inside the RegressProof boundary.");
  }
}

function assertCommittedScenario(report) {
  if (report.git.diffRange !== "HEAD~1..HEAD") {
    throw new Error(`Expected committed diffRange HEAD~1..HEAD, received ${report.git.diffRange}`);
  }

  if (report.verification.baselineMode !== "path_snapshot") {
    throw new Error(
      `Expected committed baselineMode path_snapshot, received ${report.verification.baselineMode}`,
    );
  }

  if (report.verification.currentMode !== "snapshot") {
    throw new Error(`Expected committed currentMode snapshot, received ${report.verification.currentMode}`);
  }

  if (report.verdict.classification !== "successful_change") {
    throw new Error(
      `Expected committed verdict successful_change, received ${report.verdict.classification}`,
    );
  }

  if (report.verdict.confidence !== "high") {
    throw new Error(`Expected committed confidence high, received ${report.verdict.confidence}`);
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
