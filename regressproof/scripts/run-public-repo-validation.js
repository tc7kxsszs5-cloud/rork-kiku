#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const regressproofRoot = path.resolve(__dirname, "..");

function main() {
  const args = process.argv.slice(2);
  const url = readArg(args, "--url");
  const configPath = readArg(args, "--config");
  const branchArg = readArg(args, "--branch");
  const baselineRef = readArg(args, "--baseline-ref");
  const headRef = readArg(args, "--head-ref") || "HEAD";
  const format = readArg(args, "--format") || "json";
  const repoDir =
    readArg(args, "--repo-dir") || path.join(os.tmpdir(), `regressproof-public-${Date.now()}`);
  const artifactDir =
    readArg(args, "--artifact-dir") || path.join(os.tmpdir(), "regressproof-public-artifacts");
  const ciMode = args.includes("--ci");

  if (!url) {
    throw new Error("Missing required --url");
  }
  if (!configPath) {
    throw new Error("Missing required --config");
  }
  ensureEmptyOrMissingDirectory(repoDir);

  const resolvedConfigPath = path.resolve(configPath);
  const config = JSON.parse(fs.readFileSync(resolvedConfigPath, "utf8"));
  const branch = branchArg || resolveDefaultBranch(url);
  const sparsePaths = resolveSparsePaths(config);

  process.stderr.write(`RegressProof public validation cloning ${url}#${branch}\n`);
  cloneSparse(url, branch, repoDir, sparsePaths);
  checkoutHeadRef(repoDir, headRef);
  ensureParentCommit(repoDir, headRef, branch);

  const runnerArgs = [
    path.join(regressproofRoot, "scripts", "run-committed-real-repo-validation.js"),
    "--repo",
    repoDir,
    "--config",
    resolvedConfigPath,
    "--head-ref",
    headRef,
    "--format",
    format,
    "--artifact-dir",
    artifactDir,
  ];

  if (baselineRef) {
    runnerArgs.push("--baseline-ref", baselineRef);
  }
  if (ciMode) {
    runnerArgs.push("--ci");
  }

  execFileSync("node", runnerArgs, {
    cwd: regressproofRoot,
    stdio: "inherit",
  });
}

function cloneSparse(url, branch, repoDir, sparsePaths) {
  const cloneArgs = [
    "clone",
    "--depth",
    "1",
    "--filter=blob:none",
    "--sparse",
    "--single-branch",
    "--branch",
    branch,
    url,
    repoDir,
  ];
  execFileSync("git", cloneArgs, { stdio: "inherit" });

  if (sparsePaths.length === 0) {
    return;
  }

  execFileSync("git", ["sparse-checkout", "set", "--no-cone", ...sparsePaths], {
    cwd: repoDir,
    stdio: "inherit",
  });
}

function checkoutHeadRef(repoDir, headRef) {
  if (!headRef || headRef === "HEAD") {
    return;
  }

  if (!gitOptional(repoDir, ["rev-parse", "--verify", `${headRef}^{commit}`])) {
    execFileSync("git", ["fetch", "--depth=1", "origin", headRef], {
      cwd: repoDir,
      stdio: "inherit",
    });
  }

  execFileSync("git", ["checkout", "--detach", headRef], {
    cwd: repoDir,
    stdio: "inherit",
  });
}

function ensureParentCommit(repoDir, headRef, branch) {
  const resolvedHeadRef = headRef && headRef !== "HEAD" ? headRef : "HEAD";
  if (gitOptional(repoDir, ["rev-parse", `${resolvedHeadRef}~1`])) {
    return;
  }

  execFileSync("git", ["fetch", "--deepen=1", "origin", branch], {
    cwd: repoDir,
    stdio: "inherit",
  });
}

function resolveDefaultBranch(url) {
  const output = execFileSync("git", ["ls-remote", "--symref", url, "HEAD"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });
  const match = output.match(/^ref:\s+refs\/heads\/(.+)\s+HEAD/m);
  if (!match) {
    throw new Error(`Unable to resolve default branch for ${url}`);
  }
  return match[1];
}

function resolveSparsePaths(config) {
  const paths = [];
  if (Array.isArray(config.targetPaths)) {
    paths.push(...config.targetPaths);
  }
  if (Array.isArray(config.baseline?.supportPaths)) {
    paths.push(...config.baseline.supportPaths);
  }
  if (config.executionRoot && config.executionRoot !== ".") {
    paths.push(config.executionRoot);
  }
  return Array.from(new Set(paths.map(normalizeSparsePath).filter(Boolean)));
}

function normalizeSparsePath(value) {
  return String(value || "").replace(/\\/g, "/").replace(/^\.\//, "").trim();
}

function ensureEmptyOrMissingDirectory(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return;
  }

  const entries = fs.readdirSync(targetPath);
  if (entries.length > 0) {
    throw new Error(`Refusing to clone into non-empty directory: ${targetPath}`);
  }
}

function readArg(args, name) {
  const index = args.indexOf(name);
  if (index === -1) {
    return "";
  }
  return args[index + 1] || "";
}

function gitOptional(repo, args) {
  try {
    return execFileSync("git", args, {
      cwd: repo,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

main();
