#!/usr/bin/env node

const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const regressproofRoot = path.resolve(__dirname, "..");
const fixturesRoot = path.join(regressproofRoot, "fixtures");
const exporterPath = path.join(__dirname, "export-fixture-scenario-pack.js");

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const requestedFixtures = readArgs(args, "--fixture");
  const fixtures = requestedFixtures.length > 0 ? requestedFixtures : await listFixtures();
  const results = [];

  for (const fixtureName of fixtures) {
    const fixturePath = path.isAbsolute(fixtureName)
      ? fixtureName
      : path.join(fixturesRoot, fixtureName);
    const manifestPath = path.join(fixturePath, "fixture.materializer.json");
    const hasGitRepo = fs.existsSync(path.join(fixturePath, ".git"));

    if (!hasGitRepo) {
      results.push({
        fixture: path.basename(fixturePath),
        status: "skipped",
        reason: "no_embedded_git_repo",
      });
      continue;
    }

    if (!force && fs.existsSync(manifestPath)) {
      results.push({
        fixture: path.basename(fixturePath),
        status: "skipped",
        reason: "already_has_materializer_manifest",
      });
      continue;
    }

    const output = execFileSync("node", [exporterPath, "--fixture", fixturePath], {
      cwd: path.resolve(regressproofRoot, ".."),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    results.push({
      fixture: path.basename(fixturePath),
      status: "exported",
      result: JSON.parse(output),
    });
  }

  process.stdout.write(`${JSON.stringify(summarize(results), null, 2)}\n`);
}

async function listFixtures() {
  const entries = await fsp.readdir(fixturesRoot, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}

function summarize(results) {
  return {
    product: "RegressProof",
    mode: "fixture_pack_export",
    totalFixtures: results.length,
    exportedCount: results.filter((item) => item.status === "exported").length,
    skippedCount: results.filter((item) => item.status === "skipped").length,
    fixtures: results,
  };
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
  process.stderr.write(`RegressProof bulk fixture export error: ${message}\n`);
  process.exitCode = 1;
});
