#!/usr/bin/env node

const fs = require("node:fs");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const regressproofRoot = path.resolve(__dirname, "..");
const workspaceRoot = path.resolve(regressproofRoot, "..");
const fixturesRoot = path.join(regressproofRoot, "fixtures");
const cliPath = path.join(regressproofRoot, "src", "cli.js");
const materializerPath = path.join(regressproofRoot, "scripts", "materialize-fixture.js");

async function main() {
  const args = process.argv.slice(2);
  const outDir =
    readArg(args, "--out-dir") ||
    path.join(os.tmpdir(), `regressproof-fixture-suite-${Date.now()}`);
  const requestedFixtures = readArgs(args, "--fixture");

  await fsp.mkdir(outDir, { recursive: true });

  const fixtures = requestedFixtures.length > 0 ? requestedFixtures : await listFixtures(fixturesRoot);
  const results = [];

  for (const fixtureName of fixtures) {
    const fixturePath = path.isAbsolute(fixtureName)
      ? fixtureName
      : path.join(fixturesRoot, fixtureName);
    const normalizedName = path.basename(fixturePath);
    const fixtureOutDir = path.join(outDir, normalizedName);

    await fsp.mkdir(fixtureOutDir, { recursive: true });

    try {
      const materialized = materializeFixture(fixturePath, fixtureOutDir);
      const artifactDir = path.join(fixtureOutDir, "artifacts");
      const report = runRegressProof(materialized.repoDir, materialized.configPath, artifactDir);

      results.push({
        fixture: normalizedName,
        status: "passed",
        materialization: materialized.materialization,
        report,
        artifactDir,
        materialized,
      });
    } catch (error) {
      results.push({
        fixture: normalizedName,
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const summary = summarize(results, outDir);
  const summaryPath = path.join(outDir, "fixture-suite-summary.json");
  await fsp.writeFile(summaryPath, JSON.stringify(summary, null, 2));

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

function materializeFixture(fixturePath, fixtureOutDir) {
  const output = execFileSync("node", [materializerPath, "--fixture", fixturePath, "--out-dir", fixtureOutDir], {
    cwd: workspaceRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  return JSON.parse(output);
}

function runRegressProof(repoDir, configPath, artifactDir) {
  const output = execFileSync(
    "node",
    [cliPath, "run", "--repo", repoDir, "--config", configPath, "--format", "json", "--artifact-dir", artifactDir],
    {
      cwd: workspaceRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 1024 * 1024 * 20,
    },
  );

  return JSON.parse(output);
}

function summarize(results, outDir) {
  const passed = results.filter((item) => item.status === "passed");
  const failed = results.filter((item) => item.status === "failed");

  return {
    product: "RegressProof",
    mode: "fixture_suite",
    outDir,
    totalFixtures: results.length,
    passedCount: passed.length,
    failedCount: failed.length,
    fixtures: results.map((item) =>
      item.status === "passed"
        ? {
            fixture: item.fixture,
            status: item.status,
            materialization: item.materialization,
            verdict: item.report.verdict.classification,
            confidence: item.report.verdict.confidence,
            changedFiles: item.report.git.changedFiles,
            artifactDir: item.artifactDir,
          }
        : {
            fixture: item.fixture,
            status: item.status,
            error: item.error,
          },
    ),
  };
}

async function listFixtures(rootDir) {
  const entries = await fsp.readdir(rootDir, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}

function readArg(args, name) {
  const index = args.indexOf(name);
  if (index === -1) {
    return "";
  }

  return args[index + 1] || "";
}

function readArgs(args, name) {
  const values = [];

  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === name && args[index + 1]) {
      values.push(args[index + 1]);
      index += 1;
    }
  }

  return values;
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`RegressProof fixture suite error: ${message}\n`);
  process.exitCode = 1;
});
