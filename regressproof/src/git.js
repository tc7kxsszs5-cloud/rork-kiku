const { execFile } = require("node:child_process");
const { promisify } = require("node:util");

const execFileAsync = promisify(execFile);

async function collectGitContext(baselineRef, repoPath, config = {}) {
  const repoRoot = await git(["rev-parse", "--show-toplevel"], repoPath);
  const currentBranch = await git(["rev-parse", "--abbrev-ref", "HEAD"], repoPath);
  const headCommit = await git(["rev-parse", "HEAD"], repoPath);
  const baselineCommit = await git(["rev-parse", baselineRef], repoPath);
  const compareRef = config.git?.compareRef || "HEAD";
  const compareCommit = await git(["rev-parse", compareRef], repoPath);
  const changedFiles = await resolveChangedFiles(baselineRef, compareRef, repoPath, config);

  return {
    repoRoot,
    currentBranch,
    headCommit,
    baselineRef,
    baselineCommit,
    compareRef,
    compareCommit,
    diffRange: `${baselineRef}..${compareRef}`,
    changedFiles,
    targetPaths: config.targetPaths || [],
  };
}

async function resolveChangedFiles(baselineRef, compareRef, repoPath, config) {
  const targetPaths = Array.isArray(config.targetPaths) ? config.targetPaths : [];
  const excludePaths = Array.isArray(config.git?.excludePaths) ? config.git.excludePaths : [];
  const diffMode = config.git?.diffMode || "baseline_to_head";
  const changed = new Set();

  if (diffMode === "head_vs_worktree") {
    const trackedDiffArgs = ["diff", "--name-only", compareRef];
    if (targetPaths.length > 0) {
      trackedDiffArgs.push("--", ...targetPaths);
    }

    collectOutput(await gitOptional(trackedDiffArgs, repoPath), changed);

    const untrackedArgs = ["ls-files", "--others", "--exclude-standard"];
    if (targetPaths.length > 0) {
      untrackedArgs.push("--", ...targetPaths);
    }

    collectOutput(await gitOptional(untrackedArgs, repoPath), changed);
  } else {
    const diffArgs = ["diff", "--name-only", baselineRef, compareRef];
    if (targetPaths.length > 0) {
      diffArgs.push("--", ...targetPaths);
    }

    collectOutput(await gitOptional(diffArgs, repoPath), changed);
  }

  return Array.from(changed).filter((file) => !isExcludedPath(file, excludePaths));
}

function collectOutput(output, targetSet) {
  output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => targetSet.add(line));
}

function isExcludedPath(file, excludePaths) {
  return excludePaths.some((excluded) => file === excluded || file.startsWith(excluded));
}

async function git(args, cwd) {
  const { stdout } = await execFileAsync("git", args, { encoding: "utf8", cwd });
  return stdout.trim();
}

async function gitOptional(args, cwd) {
  try {
    return await git(args, cwd);
  } catch {
    return "";
  }
}

module.exports = {
  collectGitContext,
};
