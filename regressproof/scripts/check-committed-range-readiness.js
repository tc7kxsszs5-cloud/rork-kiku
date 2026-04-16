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
  const format = readArg(args, "--format") || "text";

  const baseConfigPath = configOverride
    ? path.resolve(repo, configOverride)
    : path.join(regressproofRoot, "regressproof.real-repo.config.json");
  const baseConfig = JSON.parse(fs.readFileSync(baseConfigPath, "utf8"));
  const compareCommit = git(repo, ["rev-parse", compareRef]);
  const baselineRef = baselineOverride || resolveBaselineRef(repo, baseBranch, compareRef, compareCommit);
  const targetPaths = Array.isArray(baseConfig.targetPaths) ? baseConfig.targetPaths : [];

  const pathStatus = targetPaths.map((targetPath) => ({
    path: targetPath,
    existsAtBaseline: pathExistsAtRef(repo, baselineRef, targetPath),
    existsAtCompare: pathExistsAtRef(repo, compareRef, targetPath),
  }));

  const changedFiles = gitOptional(repo, ["diff", "--name-only", baselineRef, compareRef, "--", ...targetPaths])
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const hasExplicitBoundary = targetPaths.length > 0;
  const anyPathAtBaseline = !hasExplicitBoundary || pathStatus.some((entry) => entry.existsAtBaseline);
  const anyPathAtCompare = !hasExplicitBoundary || pathStatus.some((entry) => entry.existsAtCompare);
  const readiness =
    anyPathAtBaseline && anyPathAtCompare && changedFiles.length > 0
      ? "ready"
      : anyPathAtCompare
        ? "partial"
        : "not_ready";

  const report = {
    product: "RegressProof",
    repo,
    baselineRef,
    compareRef,
    compareCommit,
    targetPaths,
    pathStatus,
    changedFiles,
    readiness,
    summary: summarize(readiness, baselineRef, compareRef, changedFiles.length),
  };

  if (format === "json") {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    return;
  }

  process.stdout.write(renderText(report));
}

function summarize(readiness, baselineRef, compareRef, changedCount) {
  if (readiness === "ready") {
    return `Committed attribution is ready for ${baselineRef}..${compareRef} with ${changedCount} changed files inside the RegressProof boundary.`;
  }

  if (readiness === "partial") {
    return `Committed attribution is only partially ready for ${baselineRef}..${compareRef}: the RegressProof boundary exists at the compared ref but not cleanly across both sides of the range.`;
  }

  return `Committed attribution is not ready for ${baselineRef}..${compareRef}: the RegressProof project boundary is not present in committed history for this range.`;
}

function renderText(report) {
  const lines = [
    "RegressProof Committed Range Readiness",
    `Repo: ${report.repo}`,
    `Baseline ref: ${report.baselineRef}`,
    `Compare ref: ${report.compareRef}`,
    `Readiness: ${report.readiness}`,
    `Summary: ${report.summary}`,
    "",
    "Target path status:",
    ...report.pathStatus.map(
      (entry) =>
        `- ${entry.path}: baseline=${entry.existsAtBaseline ? "yes" : "no"}, compare=${entry.existsAtCompare ? "yes" : "no"}`,
    ),
    "",
    "Changed files:",
    ...(report.changedFiles.length > 0
      ? report.changedFiles.map((filePath) => `- ${filePath}`)
      : ["- none"]),
  ];

  return `${lines.join("\n")}\n`;
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

function pathExistsAtRef(repo, ref, targetPath) {
  try {
    execFileSync("git", ["cat-file", "-e", `${ref}:${targetPath}`], {
      cwd: repo,
      stdio: ["ignore", "ignore", "ignore"],
    });
    return true;
  } catch {
    return false;
  }
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
