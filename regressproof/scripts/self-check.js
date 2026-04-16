#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = process.cwd();

const REQUIRED_FILES = [
  "regressproof/package.json",
  "regressproof/regressproof.real-repo.config.json",
  "regressproof/src/cli.js",
  "regressproof/src/config.js",
  "regressproof/src/git.js",
  "regressproof/src/report.js",
  "regressproof/src/run.js",
  "regressproof/src/verify.js",
  "docs/REGRESSPROOF_INDEX.md",
];

function main() {
  for (const relativePath of REQUIRED_FILES) {
    const absolutePath = path.join(repoRoot, relativePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Missing required RegressProof file: ${relativePath}`);
    }
  }

  const packageJson = readJson("regressproof/package.json");
  const realRepoConfig = readJson("regressproof/regressproof.real-repo.config.json");

  if (packageJson.name !== "regressproof") {
    throw new Error("Unexpected package name in regressproof/package.json");
  }

  if (!Array.isArray(realRepoConfig.checks?.quick) || realRepoConfig.checks.quick.length === 0) {
    throw new Error("Real-repo config must define at least one quick check.");
  }

  if (!Array.isArray(realRepoConfig.checks?.full) || realRepoConfig.checks.full.length === 0) {
    throw new Error("Real-repo config must define at least one full check.");
  }

  require(path.join(repoRoot, "regressproof/src/config.js"));
  require(path.join(repoRoot, "regressproof/src/git.js"));
  require(path.join(repoRoot, "regressproof/src/report.js"));
  require(path.join(repoRoot, "regressproof/src/run.js"));
  require(path.join(repoRoot, "regressproof/src/verify.js"));

  process.stdout.write("RegressProof self-check passed\n");
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

main();
