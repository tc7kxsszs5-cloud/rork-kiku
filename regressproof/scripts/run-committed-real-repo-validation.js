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
  const baseBranch = readArg(args, "--base-branch") || process.env.REGRESSPROOF_BASE_BRANCH || "main";
  const compareRef = readArg(args, "--head-ref") || "HEAD";
  const baselineOverride = readArg(args, "--baseline-ref");
  const configOverride = readArg(args, "--config");
  const format = readArg(args, "--format") || "json";
  const artifactDir =
    readArg(args, "--artifact-dir") || path.join(os.tmpdir(), "regressproof-committed-real-repo");
  const ciMode = args.includes("--ci");

  const baseConfigPath = configOverride
    ? path.resolve(repo, configOverride)
    : path.join(regressproofRoot, "regressproof.real-repo.config.json");
  const baseConfig = JSON.parse(fs.readFileSync(baseConfigPath, "utf8"));
  const compareCommit = git(repo, ["rev-parse", compareRef]);
  const baselineRef = baselineOverride || resolveBaselineRef(repo, baseBranch, compareRef, compareCommit);

  const tempConfigPath = path.join(os.tmpdir(), `regressproof-real-${Date.now()}.json`);
  const tempConfig = {
    ...baseConfig,
    baselineRef,
    git: {
      ...(baseConfig.git || {}),
      compareRef,
    },
    current: {
      ...(baseConfig.current || {}),
      mode: "snapshot",
    },
  };

  fs.writeFileSync(tempConfigPath, JSON.stringify(tempConfig, null, 2));

  const cliArgs = [
    path.join(regressproofRoot, "src", "cli.js"),
    "run",
    "--repo",
    repo,
    "--config",
    tempConfigPath,
    "--format",
    format,
    "--artifact-dir",
    artifactDir,
  ];

  if (ciMode) {
    cliArgs.push("--ci");
  }

  process.stderr.write(
    `RegressProof committed validation using ${baselineRef}..${compareRef} against repo ${repo}\n`,
  );

  try {
    execFileSync("node", cliArgs, {
      cwd: regressproofRoot,
      stdio: "inherit",
    });
  } finally {
    fs.rmSync(tempConfigPath, { force: true });
  }
}

function readArg(args, name) {
  const index = args.indexOf(name);
  if (index === -1) {
    return "";
  }

  return args[index + 1] || "";
}

function resolveBaselineRef(repo, baseBranch, compareRef, compareCommit) {
  const parent = gitOptional(repo, ["rev-parse", `${compareRef}~1`]);
  if (parent && parent !== compareCommit) {
    return `${compareRef}~1`;
  }

  const mergeBase = gitOptional(repo, ["merge-base", compareRef, baseBranch]);
  if (mergeBase && mergeBase !== compareCommit) {
    return mergeBase;
  }

  return compareCommit;
}

function git(repo, args) {
  return execFileSync("git", args, {
    cwd: repo,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

function gitOptional(repo, args) {
  try {
    return git(repo, args);
  } catch {
    return "";
  }
}

main();
